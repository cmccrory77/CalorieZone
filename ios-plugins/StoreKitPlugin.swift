import Foundation
import Capacitor
import StoreKit

@objc(StoreKitPlugin)
public class StoreKitPlugin: CAPPlugin, SKProductsRequestDelegate {
    private var productsCall: CAPPluginCall?
    private var products: [String: SKProduct] = [:]

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

        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
        call.resolve(["started": true])
    }
}
