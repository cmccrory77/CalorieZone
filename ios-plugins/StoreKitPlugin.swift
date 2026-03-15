import Foundation
import Capacitor
import StoreKit

@objc(StoreKitPlugin)
public class StoreKitPlugin: CAPPlugin, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    private var productsCall: CAPPluginCall?
    private var purchaseCall: CAPPluginCall?
    private var restoreCall: CAPPluginCall?
    private var products: [String: SKProduct] = [:]

    override public func load() {
        SKPaymentQueue.default().add(self)
    }

    deinit {
        SKPaymentQueue.default().remove(self)
    }

    @objc func getProducts(_ call: CAPPluginCall) {
        guard let ids = call.getArray("productIds", String.self) else {
            call.reject("Missing productIds")
            return
        }

        productsCall = call
        let request = SKProductsRequest(productIdentifiers: Set(ids))
        request.delegate = self
        request.start()
    }

    public func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        var result: [[String: Any]] = []

        for product in response.products {
            products[product.productIdentifier] = product

            let formatter = NumberFormatter()
            formatter.numberStyle = .currency
            formatter.locale = product.priceLocale

            let localizedPrice = formatter.string(from: product.price) ?? "\(product.price)"

            result.append([
                "productId": product.productIdentifier,
                "price": localizedPrice,
                "priceRaw": product.price.doubleValue,
                "currencyCode": product.priceLocale.currencyCode ?? "USD",
                "title": product.localizedTitle,
                "description": product.localizedDescription
            ])
        }

        productsCall?.resolve(["products": result])
        productsCall = nil
    }

    public func request(_ request: SKRequest, didFailWithError error: Error) {
        productsCall?.reject("Failed to fetch products: \(error.localizedDescription)")
        productsCall = nil
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("Missing productId")
            return
        }

        guard let product = products[productId] else {
            call.reject("Product not found. Call getProducts first.")
            return
        }

        purchaseCall = call
        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        restoreCall = call
        SKPaymentQueue.default().restoreCompletedTransactions()
    }

    public func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        var purchased = false

        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                purchased = true
                SKPaymentQueue.default().finishTransaction(transaction)
            case .restored:
                purchased = true
                SKPaymentQueue.default().finishTransaction(transaction)
            case .failed:
                SKPaymentQueue.default().finishTransaction(transaction)
                if let error = transaction.error as? SKError, error.code != .paymentCancelled {
                    purchaseCall?.reject("Purchase failed: \(error.localizedDescription)")
                    purchaseCall = nil
                } else {
                    purchaseCall?.reject("Purchase cancelled")
                    purchaseCall = nil
                }
            case .deferred, .purchasing:
                break
            @unknown default:
                break
            }
        }

        if purchased {
            purchaseCall?.resolve(["success": true])
            purchaseCall = nil
        }
    }

    public func paymentQueueRestoreCompletedTransactionsFinished(_ queue: SKPaymentQueue) {
        let restored = queue.transactions.contains { $0.transactionState == .restored }
        restoreCall?.resolve(["restored": restored])
        restoreCall = nil
    }

    public func paymentQueue(_ queue: SKPaymentQueue, restoreCompletedTransactionsFailedWithError error: Error) {
        restoreCall?.reject("Restore failed: \(error.localizedDescription)")
        restoreCall = nil
    }
}
