const PRODUCTS = [
  { name: "ArceusX", imageUrl: "images/arceusx.png" },
  { name: "Bunni", imageUrl: "images/bunni.png" },
  { name: "Cryptic", imageUrl: "images/cryptic.png" },
  { name: "Exoliner", imageUrl: "images/exoliner.png" },
  { name: "Fluxus", imageUrl: "images/fluxus.png" },
  { name: "MacSploit", imageUrl: "images/macsploit.png" },
  { name: "Ronin", imageUrl: "images/ronin.png" },
  { name: "Wave", imageUrl: "images/wave.png" },
  { name: "Zenith", imageUrl: "images/zenith.png" },
  { name: "Seliware", imageUrl: "images/seliware.png" },
  { name: "Assembly", imageUrl: "images/assembly.png" },
  { name: "Valex", imageUrl: "images/valex.png" },
]

const PAYMENT_OPTIONS = ["crypto", "paypal", "stripe", "cashapp", "venmo", "bank transfer"]

class JsonBuilder {
  constructor() {
    this.currentStep = 1
    this.resellerName = ""
    this.resellerPfp = ""
    this.selectedProduct = null
    this.selectedPayments = []
    this.products = []
    this.editingPaymentProductId = null
    this.tempPaymentInput = []

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.renderProductGrid()
    this.renderPaymentOptions()
    this.updateJsonOutput()
    this.showStep(1)
  }

  setupEventListeners() {
    document.getElementById("nextStep1").addEventListener("click", () => this.goToStep(2))
    document.getElementById("backStep2").addEventListener("click", () => this.goToStep(1))
    document.getElementById("doneStep2").addEventListener("click", () => this.goToStep(3))
    document.getElementById("backStep3").addEventListener("click", () => this.goToStep(2))

    document.getElementById("resetBtn").addEventListener("click", () => this.resetAll())
    document.getElementById("startOverBtn").addEventListener("click", () => this.resetAll())

    document.getElementById("resellerName").addEventListener("input", (e) => {
      this.resellerName = e.target.value
      this.validateStep1()
      this.updateJsonOutput()
    })

    document.getElementById("resellerPfp").addEventListener("input", (e) => {
      this.resellerPfp = e.target.value
      this.validateStep1()
      this.updatePfpPreview()
      this.updateJsonOutput()
    })

    document.getElementById("addProductBtn").addEventListener("click", () => this.addProduct())

    document.getElementById("copyJsonBtn").addEventListener("click", () => this.copyJson())
  }

  showStep(step) {
    document.getElementById("step1").classList.add("hidden")
    document.getElementById("step2").classList.add("hidden")
    document.getElementById("step3").classList.add("hidden")

    document.getElementById(`step${step}`).classList.remove("hidden")

    const resetBtn = document.getElementById("resetBtn")
    if (step === 3) {
      resetBtn.classList.add("hidden")
    } else {
      resetBtn.classList.remove("hidden")
    }

    this.currentStep = step
  }

  goToStep(step) {
    this.showStep(step)
  }

  validateStep1() {
    const isValid = this.resellerName.trim() && this.resellerPfp.trim()
    document.getElementById("nextStep1").disabled = !isValid
  }

  updatePfpPreview() {
    const preview = document.getElementById("pfpPreview")
    const image = document.getElementById("pfpImage")

    if (this.resellerPfp.trim()) {
      image.src = this.resellerPfp.trim()
      image.onerror = () => {
        image.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik02MCA0MEMzNS44IDQwIDIwIDU1LjggMjAgODBTMzUuOCAxMjAgNjAgMTIwUzEwMCAxMDQuMiAxMDAgODBTODQuMiA0MCA2MCA0MFoiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+"
      }
      preview.classList.remove("hidden")
    } else {
      preview.classList.add("hidden")
    }
  }

  renderProductGrid() {
    const grid = document.getElementById("productGrid")
    grid.innerHTML = ""

    PRODUCTS.forEach((product) => {
      const item = document.createElement("div")
      item.className = "product-item"
      item.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMxOC43IDIwIDEwIDI4LjcgMTAgNDJTMTguNyA2NCAzMiA2NFM1NCA1NS4zIDU0IDQyUzQ1LjMgMjAgMzIgMjBaIiBmaWxsPSIjRDlEOUQ5Ii8+Cjwvc3ZnPg=='">
                <span>${product.name}</span>
            `

      item.addEventListener("click", () => this.selectProduct(product))
      grid.appendChild(item)
    })
  }

  selectProduct(product) {
    document.querySelectorAll(".product-item").forEach((item) => {
      item.classList.remove("selected")
    })

    event.currentTarget.classList.add("selected")

    this.selectedProduct = product
    document.getElementById("selectedProductText").textContent = `Selected Product: ${product.name}`

    this.validateAddProduct()
    this.showToast("Product Selected!", `'${product.name}' has been selected.`, "success")
  }

  renderPaymentOptions() {
    const container = document.getElementById("paymentOptions")
    container.innerHTML = ""

    PAYMENT_OPTIONS.forEach((payment) => {
      const btn = document.createElement("button")
      btn.className = "payment-btn"
      btn.textContent = payment
      btn.addEventListener("click", () => this.togglePayment(payment, btn))
      container.appendChild(btn)
    })
  }

  togglePayment(payment, btnElement) {
    if (this.selectedPayments.includes(payment)) {
      this.selectedPayments = this.selectedPayments.filter((p) => p !== payment)
      btnElement.classList.remove("selected")
    } else {
      this.selectedPayments.push(payment)
      btnElement.classList.add("selected")
    }

    this.validateAddProduct()
  }

  validateAddProduct() {
    const isValid = this.selectedProduct && this.selectedPayments.length > 0
    document.getElementById("addProductBtn").disabled = !isValid
  }

  addProduct() {
    if (!this.resellerName.trim() || !this.resellerPfp.trim()) {
      this.showToast("Missing Reseller Info", "Please fill in Reseller Name and Profile Picture URL first.", "error")
      return
    }

    if (!this.selectedProduct || this.selectedPayments.length === 0) {
      this.showToast("Missing Product Info", "Please select a Product and at least one Payment Method.", "error")
      return
    }

    if (this.products.some((p) => p.name.toLowerCase() === this.selectedProduct.name.toLowerCase())) {
      this.showToast("Product Already Added", `'${this.selectedProduct.name}' is already in your list.`, "error")
      return
    }

    this.setAddProductLoading(true)

    const newProduct = {
      id: this.generateId(),
      name: this.selectedProduct.name.toLowerCase(),
      imageUrl: this.selectedProduct.imageUrl,
      payments: [...this.selectedPayments],
      durations: [],
    }

    this.products.push(newProduct)

    this.selectedProduct = null
    this.selectedPayments = []
    document.querySelectorAll(".product-item").forEach((item) => item.classList.remove("selected"))
    document.querySelectorAll(".payment-btn").forEach((btn) => btn.classList.remove("selected"))
    document.getElementById("selectedProductText").textContent = "Please select a product from the list above."

    this.renderProductsList()
    this.validateStep2()
    this.updateJsonOutput()

    this.showToast("Product Added!", `'${newProduct.name}' has been added.`, "success")

    setTimeout(() => {
      this.setAddProductLoading(false)
      const newProductElement = document.querySelector(`[data-product-id="${newProduct.id}"]`)
      if (newProductElement) {
        newProductElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 500)
  }

  setAddProductLoading(loading) {
    const btn = document.getElementById("addProductBtn")
    const text = document.getElementById("addProductText")
    const loader = document.getElementById("addProductLoader")

    if (loading) {
      text.textContent = "Adding Product..."
      loader.classList.remove("hidden")
      btn.disabled = true
    } else {
      text.textContent = "Add Product"
      loader.classList.add("hidden")
      this.validateAddProduct()
    }
  }

  renderProductsList() {
    const container = document.getElementById("productsList")
    const manageCard = document.getElementById("manageProductsCard")

    if (this.products.length === 0) {
      manageCard.classList.add("hidden")
      return
    }

    manageCard.classList.remove("hidden")
    container.innerHTML = ""

    this.products.forEach((product, index) => {
      const productCard = this.createProductCard(product, index)
      container.appendChild(productCard)
    })
  }

  createProductCard(product, index) {
    const card = document.createElement("div")
    card.className = "product-card"
    card.setAttribute("data-product-id", product.id)

    card.innerHTML = `
            <div class="product-header">
                <div class="product-info">
                    <img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjRGNEY1Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxMS43IDEyIDYgMTcuNyA2IDI2UzExLjcgNDAgMjAgNDBTMzQgMzQuMyAzNCAyNlMyOC4zIDEyIDIwIDEyWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4='">
                    <h3>${product.name}</h3>
                </div>
                <button class="btn btn-outline btn-icon" onclick="jsonBuilder.removeProduct('${product.id}', '${product.name}')">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m18 6-12 12"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </button>
            </div>
            
            <div class="product-payments">
                <span>Payments:</span>
                ${
                  product.payments.length > 0
                    ? product.payments.map((payment) => `<span class="badge">${payment}</span>`).join("")
                    : '<span class="badge badge-outline">No payments specified</span>'
                }
                <div class="tooltip">
                    <button class="btn btn-outline btn-icon" style="width: 1.5rem; height: 1.5rem; padding: 0;" onclick="jsonBuilder.editPayments('${product.id}')">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 0.75rem; height: 0.75rem;">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                        </svg>
                    </button>
                    <span class="tooltip-text">Edit Payment Methods</span>
                </div>
            </div>
            
            <div class="duration-section">
                <h4 style="font-weight: 500; margin-bottom: 1rem;">Add Duration for ${product.name}</h4>
                <div class="duration-form">
                    <div class="form-group">
                        <label>Duration (Days)</label>
                        <input type="text" id="duration-${product.id}" placeholder="e.g., 7 days, 1 month, lifetime, 30">
                        <p class="form-help">Enter the duration (e.g., '7 days', '1 month', 'lifetime', '30'). Will be converted to days or 'lifetime'.</p>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="text" id="price-${product.id}" placeholder="e.g., 8.99, 15.00">
                        <p class="form-help">Enter the price (e.g., 8.99).</p>
                    </div>
                    <div class="form-group">
                        <label>Product URL</label>
                        <input type="text" id="url-${product.id}" placeholder="e.g., https://yourstore.com/purchase/...">
                        <p class="form-help">The direct purchase link for this duration.</p>
                    </div>
                </div>
                <button class="btn btn-primary btn-full" onclick="jsonBuilder.addDuration(${index})">
                    Add Duration
                </button>
                
                ${
                  product.durations.length > 0
                    ? `
                    <div class="duration-list">
                        <h4 style="font-weight: 500; margin-bottom: 0.5rem;">Existing Durations:</h4>
                        ${product.durations
                          .map(
                            (duration) => `
                            <div class="duration-item">
                                <span>
                                    <strong>${duration.duration === "lifetime" ? "Lifetime" : duration.duration + " days"}:</strong>
                                    $${duration.price} 
                                    (<a href="${duration.url}" target="_blank" rel="noopener noreferrer" class="duration-link">Link</a>)
                                </span>
                                <button class="btn btn-outline btn-icon" onclick="jsonBuilder.removeDuration(${index}, '${duration.id}', '${duration.duration}', '${product.name}')">
                                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="m18 6-12 12"/>
                                        <path d="m6 6 12 12"/>
                                    </svg>
                                </button>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : `
                    <p class="form-help" style="margin-top: 1rem;">No durations added for this product yet. Add one above!</p>
                `
                }
            </div>
        `

    return card
  }

  removeProduct(id, name) {
    this.products = this.products.filter((product) => product.id !== id)
    this.renderProductsList()
    this.validateStep2()
    this.updateJsonOutput()
    this.showToast("Product Removed!", `'${name}' has been removed.`, "success")
  }

  editPayments(productId) {
    const product = this.products.find((p) => p.id === productId)
    if (!product) return

    this.editingPaymentProductId = productId
    this.tempPaymentInput = [...product.payments]

    const productCard = document.querySelector(`[data-product-id="${productId}"]`)
    const paymentsDiv = productCard.querySelector(".product-payments")

    paymentsDiv.innerHTML = `
            <div style="margin-bottom: 0.5rem;">
                <label>Edit Payment Methods</label>
            </div>
            <div class="payment-options">
                ${PAYMENT_OPTIONS.map(
                  (payment) => `
                    <button class="payment-btn ${this.tempPaymentInput.includes(payment) ? "selected" : ""}" 
                            onclick="jsonBuilder.toggleTempPayment('${payment}', this)">
                        ${payment}
                    </button>
                `,
                ).join("")}
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                <button class="btn btn-primary btn-sm" onclick="jsonBuilder.savePayments('${productId}')">Save</button>
                <button class="btn btn-outline btn-sm" onclick="jsonBuilder.cancelEditPayments('${productId}')">Cancel</button>
            </div>
        `
  }

  toggleTempPayment(payment, btnElement) {
    if (this.tempPaymentInput.includes(payment)) {
      this.tempPaymentInput = this.tempPaymentInput.filter((p) => p !== payment)
      btnElement.classList.remove("selected")
    } else {
      this.tempPaymentInput.push(payment)
      btnElement.classList.add("selected")
    }
  }

  savePayments(productId) {
    const productIndex = this.products.findIndex((p) => p.id === productId)
    if (productIndex === -1) return

    this.products[productIndex].payments = [...this.tempPaymentInput]
    this.editingPaymentProductId = null
    this.tempPaymentInput = []

    this.renderProductsList()
    this.updateJsonOutput()
    this.showToast("Payments Updated!", "Payment methods have been saved.", "success")
  }

  cancelEditPayments(productId) {
    this.editingPaymentProductId = null
    this.tempPaymentInput = []
    this.renderProductsList()
    this.showToast("Edit Canceled", "Payment method changes were discarded.", "success")
  }

  addDuration(productIndex) {
    const product = this.products[productIndex]
    const durationInput = document.getElementById(`duration-${product.id}`)
    const priceInput = document.getElementById(`price-${product.id}`)
    const urlInput = document.getElementById(`url-${product.id}`)

    const rawDuration = durationInput.value.trim()
    const parsedDuration = this.parseDurationInput(rawDuration)
    const price = priceInput.value.trim()
    const url = urlInput.value.trim()

    if (!parsedDuration || !price || !url) {
      this.showToast(
        "Missing or Invalid Duration Info",
        "Please enter a valid duration (e.g., '7 days', '1 month', 'lifetime', '30'), price, and URL.",
        "error",
      )
      return
    }

    const newDuration = {
      id: this.generateId(),
      duration: parsedDuration,
      price: price,
      url: url,
    }

    this.products[productIndex].durations.push(newDuration)

    durationInput.value = ""
    priceInput.value = ""
    urlInput.value = ""

    this.renderProductsList()
    this.updateJsonOutput()

    const durationText = parsedDuration === "lifetime" ? "Lifetime" : parsedDuration + " days"
    this.showToast("Duration Added!", `'${durationText}' added to ${product.name}.`, "success")
  }

  removeDuration(productIndex, durationId, durationValue, productName) {
    this.products[productIndex].durations = this.products[productIndex].durations.filter(
      (duration) => duration.id !== durationId,
    )

    this.renderProductsList()
    this.updateJsonOutput()

    const durationText = durationValue === "lifetime" ? "Lifetime" : durationValue + " days"
    this.showToast("Duration Removed!", `'${durationText}' removed from ${productName}.`, "success")
  }

  parseDurationInput(input) {
    const lowerInput = input.toLowerCase().trim()

    if (lowerInput === "lifetime") {
      return "lifetime"
    }

    const dayMatch = lowerInput.match(/(\d+)\s*(days?)/)
    if (dayMatch) {
      return dayMatch[1]
    }

    const monthMatch = lowerInput.match(/(\d+)\s*(months?)/)
    if (monthMatch) {
      return (Number.parseInt(monthMatch[1]) * 30).toString()
    }

    const yearMatch = lowerInput.match(/(\d+)\s*(years?)/)
    if (yearMatch) {
      return (Number.parseInt(yearMatch[1]) * 365).toString()
    }

    const numberMatch = lowerInput.match(/^(\d+)$/)
    if (numberMatch) {
      return numberMatch[1]
    }

    return ""
  }

  validateStep2() {
    document.getElementById("doneStep2").disabled = this.products.length === 0
  }

  updateJsonOutput() {
    if (!this.resellerName.trim()) {
      document.getElementById("jsonOutput").innerHTML = "<code>{}</code>"
      return
    }

    const resellerData = {
      pfp: this.resellerPfp.trim(),
    }

    this.products.forEach((product) => {
      const productDetails = {
        payments: product.payments,
      }

      product.durations.forEach((duration) => {
        productDetails[duration.duration] = {
          price: duration.price,
          url: duration.url,
        }
      })

      resellerData[product.name] = productDetails
    })

    const finalJson = {
      [this.resellerName.trim()]: resellerData,
    }

    const jsonString = JSON.stringify(finalJson, null, 2)
    document.getElementById("jsonOutput").innerHTML = `<code>${this.escapeHtml(jsonString)}</code>`
  }

  copyJson() {
    const jsonText = document.getElementById("jsonOutput").textContent

    navigator.clipboard
      .writeText(jsonText)
      .then(() => {
        const copyIcon = document.getElementById("copyIcon")
        const checkIcon = document.getElementById("checkIcon")
        const copyText = document.getElementById("copyText")

        copyIcon.classList.add("hidden")
        checkIcon.classList.remove("hidden")
        copyText.textContent = "Copied!"

        this.showToast("JSON Copied!", "The generated JSON has been copied to your clipboard.", "success")

        setTimeout(() => {
          copyIcon.classList.remove("hidden")
          checkIcon.classList.add("hidden")
          copyText.textContent = "Copy JSON"
        }, 2000)
      })
      .catch(() => {
        this.showToast("Copy Failed", "Failed to copy JSON to clipboard.", "error")
      })
  }

  resetAll() {
    this.currentStep = 1
    this.resellerName = ""
    this.resellerPfp = ""
    this.selectedProduct = null
    this.selectedPayments = []
    this.products = []
    this.editingPaymentProductId = null
    this.tempPaymentInput = []

    document.getElementById("resellerName").value = ""
    document.getElementById("resellerPfp").value = ""

    document.getElementById("pfpPreview").classList.add("hidden")
    document.querySelectorAll(".product-item").forEach((item) => item.classList.remove("selected"))
    document.querySelectorAll(".payment-btn").forEach((btn) => btn.classList.remove("selected"))
    document.getElementById("selectedProductText").textContent = "Please select a product from the list above."

    this.validateStep1()
    this.validateAddProduct()
    this.validateStep2()
    this.renderProductsList()
    this.updateJsonOutput()
    this.showStep(1)

    this.showToast("Builder Reset!", "All fields have been cleared.", "success")
  }

  showToast(title, description, type = "success") {
    const container = document.getElementById("toastContainer")
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-description">${description}</div>
        `

    container.appendChild(toast)

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 4000)
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

let jsonBuilder
document.addEventListener("DOMContentLoaded", () => {
  jsonBuilder = new JsonBuilder()
})
