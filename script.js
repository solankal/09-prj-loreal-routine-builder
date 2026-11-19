/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productSearch = document.getElementById("productSearch");
const productsContainer = document.getElementById("productsContainer");
const selectedProductsList = document.getElementById("selectedProductsList");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const descriptionModal = document.getElementById("descriptionModal");
const modalContent = document.getElementById("modalContent");
const generateRoutineBtn = document.getElementById("generateRoutine");
const closeModalBtn = document.getElementById("closeModalBtn");

/* Keep track of selected products */
const selectedProducts = new Map(); // Maps product id to product object

/* Keep track of all products for modal descriptions */
let allProducts = [];

/* Keep track of conversation history for context */
const conversationHistory = [];

/* Track if routine has been generated */
let routineGenerated = false;

/* Store the last loaded category for filtering on search */
let currentCategory = "";

/* Show initial placeholder until user selects a category */
showProductsPlaceholder();

function showProductsPlaceholder() {
  productsContainer.innerHTML = `
    <div class="placeholder-message">
      Select a category to view products
    </div>
  `;
}

/* Load saved products from localStorage when page loads */
function loadSavedProducts() {
  const saved = localStorage.getItem("selectedProducts");
  if (saved) {
    try {
      const savedArray = JSON.parse(saved);
      savedArray.forEach(([id, product]) => {
        selectedProducts.set(id, product);
      });
      updateSelectedProductsList();
    } catch (error) {
      console.error("Error loading saved products:", error);
    }
  }
}

/* Save selected products to localStorage */
function saveProducts() {
  const productsArray = Array.from(selectedProducts.entries());
  localStorage.setItem("selectedProducts", JSON.stringify(productsArray));
}

/* Close modal when clicking the X button */
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    descriptionModal.classList.remove("active");
  });
}

/* Close modal when clicking outside of it */
descriptionModal.addEventListener("click", (e) => {
  if (e.target === descriptionModal) {
    descriptionModal.classList.remove("active");
  }
});

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  allProducts = data.products; // Store all products for modal descriptions
  return data.products;
}

/* Open description modal for a product */
function openDescriptionModal(productId) {
  const product = allProducts.find((p) => p.id == productId);
  if (!product) return;

  /* Populate modal with product details */
  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${product.name}</h2>
      <button class="close-btn" id="closeModalBtn">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body">
      <img src="${product.image}" alt="${product.name}" class="modal-image">
      <p class="modal-brand"><strong>Brand:</strong> ${product.brand}</p>
      <p class="modal-category"><strong>Category:</strong> ${product.category}</p>
      <p class="modal-description">${product.description}</p>
    </div>
  `;

  /* Reattach close button listener */
  document.getElementById("closeModalBtn").addEventListener("click", () => {
    descriptionModal.classList.remove("active");
  });

  /* Show modal */
  descriptionModal.classList.add("active");
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        No products found. Try a different search or category.
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" data-product-id="${product.id}" data-product-name="${product.name}" data-product-brand="${product.brand}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
      </div>
      <button class="info-btn" data-product-id="${product.id}" title="View product details">
        <i class="fa-solid fa-circle-info"></i>
      </button>
    </div>
  `
    )
    .join("");

  /* Add click event listener to each product card for selection */
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", toggleProductSelection);
  });

  /* Add click event listeners to info buttons for description modal */
  document.querySelectorAll(".info-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering card selection
      const productId = btn.dataset.productId;
      openDescriptionModal(productId);
    });
  });
}

/* Toggle product selection when card is clicked */
function toggleProductSelection(e) {
  const card = e.currentTarget;
  const productId = card.dataset.productId;
  const productName = card.dataset.productName;
  const productBrand = card.dataset.productBrand;

  if (selectedProducts.has(productId)) {
    /* Remove product if already selected */
    selectedProducts.delete(productId);
    card.classList.remove("selected");
  } else {
    /* Add product if not selected */
    selectedProducts.set(productId, { name: productName, brand: productBrand });
    card.classList.add("selected");
  }

  /* Update the selected products list and save to localStorage */
  updateSelectedProductsList();
  saveProducts();
}

/* Update the "Selected Products" section */
function updateSelectedProductsList() {
  if (selectedProducts.size === 0) {
    selectedProductsList.innerHTML = `
      <p class="empty-message">No products selected yet</p>
    `;
    // Disable generate button if no products selected
    generateRoutineBtn.disabled = true;
    generateRoutineBtn.title = "Select at least one product";
    return;
  }

  // Enable generate button if products are selected
  generateRoutineBtn.disabled = false;
  generateRoutineBtn.title = "Generate a personalized routine";

  selectedProductsList.innerHTML = Array.from(selectedProducts.entries())
    .map(
      ([productId, product]) => `
    <div class="selected-item">
      <span>${product.name} - ${product.brand}</span>
      <button class="remove-btn" data-product-id="${productId}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `
    )
    .join("");

  /* Add "Clear All" button after the list */
  const clearAllBtn = document.createElement("button");
  clearAllBtn.id = "clearAllBtn";
  clearAllBtn.className = "clear-all-btn";
  clearAllBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Clear All`;
  selectedProductsList.appendChild(clearAllBtn);

  /* Add click event listeners to remove buttons */
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = btn.dataset.productId;
      removeProduct(productId);
    });
  });

  /* Add click event listener to clear all button */
  clearAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearAllProducts();
  });
}

/* Remove a product from selected list and update UI */
function removeProduct(productId) {
  selectedProducts.delete(productId);

  /* Remove visual selection from card if it exists */
  const card = document.querySelector(
    `.product-card[data-product-id="${productId}"]`
  );
  if (card) {
    card.classList.remove("selected");
  }

  /* Update the selected products list and save to localStorage */
  updateSelectedProductsList();
  saveProducts();
}

/* Clear all selected products */
function clearAllProducts() {
  selectedProducts.clear();

  /* Remove visual selection from all cards */
  document.querySelectorAll(".product-card.selected").forEach((card) => {
    card.classList.remove("selected");
  });

  /* Update the selected products list and save to localStorage */
  updateSelectedProductsList();
  saveProducts();
}

/* Filter products based on category and search query */
async function filterProducts() {
  const products = await loadProducts();
  const selectedCategory = categoryFilter.value;
  const searchQuery = productSearch.value.toLowerCase().trim();

  /* Filter by category first */
  let filteredProducts = products;
  if (selectedCategory) {
    currentCategory = selectedCategory;
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

  /* Then filter by search query (search in name, brand, and description) */
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.brand.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );
  }

  displayProducts(filteredProducts);

  /* Visually mark products that are already selected */
  filteredProducts.forEach((product) => {
    if (selectedProducts.has(product.id)) {
      const card = document.querySelector(
        `.product-card[data-product-id="${product.id}"]`
      );
      if (card) {
        card.classList.add("selected");
      }
    }
  });
}

/* Event listeners for category filter and search */
categoryFilter.addEventListener("change", filterProducts);
productSearch.addEventListener("input", filterProducts);

/* Add a message to the chat window */
function addMessageToChat(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  
  const messageContent = document.createElement("div");
  messageContent.className = "message-content";
  messageContent.textContent = text;
  
  messageDiv.appendChild(messageContent);
  chatWindow.appendChild(messageDiv);
  
  /* Auto-scroll to bottom */
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Show initial chat message */
function initializeChat() {
  chatWindow.innerHTML = "";
  if (!routineGenerated) {
    addMessageToChat(
      "👋 Welcome! Select products and click 'Generate Routine' to get started.",
      "assistant"
    );
  }
}

/* Generate routine using the Cloudflare Worker */
async function generateRoutine() {
  if (selectedProducts.size === 0) {
    addMessageToChat("❌ Please select at least one product first.", "assistant");
    return;
  }

  try {
    // Clear previous chat and add loading indicator
    chatWindow.innerHTML = "";
    addMessageToChat(
      "✨ Generating your personalized routine...",
      "assistant"
    );

    // Collect full product data for selected products
    const selectedProductsData = Array.from(selectedProducts.entries()).map(
      ([id, product]) => {
        const fullProduct = allProducts.find((p) => p.id == id);
        return {
          id: fullProduct.id,
          name: fullProduct.name,
          brand: fullProduct.brand,
          category: fullProduct.category,
          description: fullProduct.description,
        };
      }
    );

    // Create the system message for the routine builder
    const systemMessage = {
      role: "system",
      content: `You are a L'Oréal skincare and beauty advisor. You help users build personalized beauty routines based on their selected products. 
      
When given a list of products, create a detailed, step-by-step routine that explains:
1. What each product does
2. How to use each product (application order and technique)
3. Best time to use (morning, evening, or both)
4. Any important tips or precautions
5. Expected benefits over time

Keep your responses friendly, professional, and educational. You can answer follow-up questions about the routine, skincare, haircare, makeup, fragrance, and other beauty-related topics.`,
    };

    // Create the user message with selected products
    const userMessage = {
      role: "user",
      content: `I want to build a routine with these L'Oréal products:\n\n${selectedProductsData
        .map((p) => `- ${p.name} by ${p.brand} (${p.category})\n  Description: ${p.description}`)
        .join("\n")}\n\nPlease create a personalized routine for me.`,
    };

    // Add user message to conversation history
    conversationHistory.push(userMessage);

    // Build messages array for the API call
    const messages = [systemMessage, ...conversationHistory];

    // Call the Cloudflare Worker
    const workerUrl =
      "https://loreal-routine.solankal.workers.dev/";

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const assistantReply =
      data.choices[0].message.content;

    // Add assistant response to conversation history
    conversationHistory.push({
      role: "assistant",
      content: assistantReply,
    });

    // Clear loading message and display routine
    chatWindow.innerHTML = "";
    addMessageToChat(assistantReply, "assistant");

    // Set flag that routine has been generated
    routineGenerated = true;

    // Enable chat input
    userInput.disabled = false;
    userInput.placeholder = "Ask a follow-up question about your routine...";
    userInput.focus();
  } catch (error) {
    console.error("Error generating routine:", error);
    addMessageToChat(
      `❌ Error: ${error.message}. Please try again or check the Cloudflare Worker URL.`,
      "assistant"
    );
  }
}

/* Handle Generate Routine button click */
generateRoutineBtn.addEventListener("click", generateRoutine);

/* Handle chat form submission for follow-up questions */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!userInput.value.trim()) return;

  if (!routineGenerated) {
    addMessageToChat(
      "👋 Please generate a routine first by clicking 'Generate Routine' button.",
      "assistant"
    );
    return;
  }

  try {
    // Add user message to chat
    const userQuestion = userInput.value.trim();
    addMessageToChat(userQuestion, "user");
    userInput.value = "";

    // Add user message to conversation history
    conversationHistory.push({
      role: "user",
      content: userQuestion,
    });

    // Show loading indicator
    addMessageToChat("⏳ Thinking...", "assistant");

    // Build messages array with conversation history
    const systemMessage = {
      role: "system",
      content: `You are a L'Oréal skincare and beauty advisor. You help users build personalized beauty routines based on their selected products. 
      
When given a list of products, create a detailed, step-by-step routine that explains:
1. What each product does
2. How to use each product (application order and technique)
3. Best time to use (morning, evening, or both)
4. Any important tips or precautions
5. Expected benefits over time

Keep your responses friendly, professional, and educational. You can answer follow-up questions about the routine, skincare, haircare, makeup, fragrance, and other beauty-related topics.`,
    };

    const messages = [systemMessage, ...conversationHistory];

    // Call the Cloudflare Worker
    const workerUrl =
      "https://loreal-routine.solankal.workers.dev/";

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const assistantReply = data.choices[0].message.content;

    // Add assistant response to conversation history
    conversationHistory.push({
      role: "assistant",
      content: assistantReply,
    });

    // Remove loading indicator and add actual response
    const lastMessage = chatWindow.lastChild;
    if (lastMessage && lastMessage.textContent.includes("⏳ Thinking...")) {
      chatWindow.removeChild(lastMessage);
    }
    addMessageToChat(assistantReply, "assistant");
  } catch (error) {
    console.error("Error sending message:", error);
    addMessageToChat(
      `❌ Error: ${error.message}. Please try again.`,
      "assistant"
    );
  }
});

/* Load saved products and initialize chat when page loads */
window.addEventListener("load", () => {
  loadSavedProducts();
  initializeChat();
});
