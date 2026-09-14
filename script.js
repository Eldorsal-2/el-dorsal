/* ========================================
   EL DORSAL
   Carrito + Categorías + Buscador
   Personalización de camisetas
   Talla de niño para CONJUNTOS
   Guía de TALLAS
   Datos del cliente + Formspree
======================================== */

document.addEventListener("DOMContentLoaded", () => {

  const cartButton = document.querySelector(".cart-button");
  const cartPanel = document.querySelector(".cart-panel");
  const closeCartButton = document.querySelector(".close-cart");
  const cartProducts = document.querySelector(".cart-products");
  const cartTotal = document.querySelector(".cart-total");
  const checkoutButton = document.querySelector(".checkout-button");
  const searchInput = document.querySelector("#product-search");
  const clearSearchButton = document.querySelector("#clear-search");

  const tallasSection =
    document.querySelector("#tallas");

  let cart = [];

  try {

    const savedCart =
      localStorage.getItem("elDorsalCart");

    if (savedCart) {

      const savedData =
        JSON.parse(savedCart);

      if (Array.isArray(savedData)) {
        cart = savedData;
      }
    }

  } catch (error) {

    console.error(
      "No se pudo cargar el carrito:",
      error
    );

    cart = [];
  }

  let currentCategory = "all";

  let currentSearch = "";


  /* ========================================
     FUNCIONES GENERALES
  ======================================== */

  function normalizeText(text) {

    return String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }


  function normalizeCategory(category) {

    const value =
      normalizeText(category);

    if (
      value === "conjuntos" ||
      value === "conjunto" ||
      value === "ninos" ||
      value === "ninas"
    ) {
      return "conjuntos";
    }

    return value;
  }


  function getProductCards() {

    return document.querySelectorAll(
      ".product-card"
    );
  }


  function getProductSearchText(card) {

    let text = "";

    const nameElement =
      card.querySelector(
        ".product-name"
      );

    if (nameElement) {
      text +=
        " " +
        nameElement.textContent;
    }

    text +=
      " " +
      card.textContent;

    const image =
      card.querySelector("img");

    if (image) {

      text +=
        " " +
        (
          image.getAttribute("alt") ||
          ""
        );

      let fileName =
        image.getAttribute("src") ||
        "";

      fileName =
        fileName
          .split("/")
          .pop()
          .split("?")[0]
          .split("#")[0];

      fileName =
        fileName.replace(
          /\.(jpg|jpeg|png|webp|gif|avif)$/i,
          ""
        );

      text +=
        " " +
        fileName;
    }

    return normalizeText(text);
  }


  /* ========================================
     MOSTRAR / OCULTAR TALLAS
  ======================================== */

  function showTallas() {

    if (tallasSection) {

      tallasSection.style.display =
        "block";
    }

    const productGrids =
      document.querySelectorAll(
        ".products-grid"
      );

    productGrids.forEach((grid) => {

      grid.style.display =
        "none";
    });
  }


  function hideTallas() {

    if (tallasSection) {

      tallasSection.style.display =
        "none";
    }

    const productGrids =
      document.querySelectorAll(
        ".products-grid"
      );

    productGrids.forEach((grid) => {

      grid.style.display =
        "";
    });
  }


  /* ========================================
     FILTROS Y BUSCADOR
  ======================================== */

  function filterProducts() {

    if (
      normalizeCategory(
        currentCategory
      ) === "tallas"
    ) {

      showTallas();

      return;
    }

    hideTallas();

    const cards =
      getProductCards();

    const searchText =
      normalizeText(
        currentSearch
      );

    const selectedCategory =
      normalizeCategory(
        currentCategory
      );

    const grids =
      document.querySelectorAll(
        ".products-grid"
      );

    grids.forEach((grid) => {

      const gridCards =
        grid.querySelectorAll(
          ":scope > .product-card"
        );

      let visibleInGrid = 0;

      gridCards.forEach((card) => {

        const productCategory =
          normalizeCategory(
            card.getAttribute(
              "data-category"
            ) || "all"
          );

        const categoryMatches =
          selectedCategory === "all" ||
          productCategory ===
            selectedCategory;

        const productText =
          getProductSearchText(
            card
          );

        const searchMatches =
          searchText === "" ||
          productText.includes(
            searchText
          );

        if (
          categoryMatches &&
          searchMatches
        ) {

          card.hidden = false;

          card.removeAttribute(
            "hidden"
          );

          visibleInGrid++;

        } else {

          card.hidden = true;

          card.setAttribute(
            "hidden",
            ""
          );
        }
      });


      let noProductsMessage =
        grid.querySelector(
          ":scope > .no-products"
        );


      if (
        gridCards.length > 0 &&
        visibleInGrid === 0
      ) {

        if (!noProductsMessage) {

          noProductsMessage =
            document.createElement(
              "div"
            );

          noProductsMessage.className =
            "no-products";

          grid.appendChild(
            noProductsMessage
          );
        }


        if (searchText !== "") {

          noProductsMessage.textContent =
            `No se encontraron camisetas para "${currentSearch}".`;

        } else {

          noProductsMessage.textContent =
            "No hay camisetas en esta categoría.";
        }

      } else {

        if (noProductsMessage) {

          noProductsMessage.remove();
        }
      }
    });


    console.log(
      "Categoría:",
      currentCategory
    );

    console.log(
      "Productos encontrados:",
      cards.length
    );
  }


  /* ========================================
     BOTONES DE CATEGORÍAS
  ======================================== */

  const categoryButtons =
    document.querySelectorAll(
      ".category-button"
    );


  categoryButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        currentCategory =
          button.getAttribute(
            "data-category"
          ) || "all";


        categoryButtons.forEach(
          (btn) => {

            btn.classList.remove(
              "active"
            );
          }
        );


        button.classList.add(
          "active"
        );


        filterProducts();
      }
    );
  });


  /* ========================================
     BUSCADOR
  ======================================== */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        currentSearch =
          searchInput.value;

        /*
          Si estamos viendo TALLAS,
          el buscador no debe ocultar
          la guía.
        */

        if (
          normalizeCategory(
            currentCategory
          ) === "tallas"
        ) {
          return;
        }

        filterProducts();
      }
    );
  }


  if (clearSearchButton) {

    clearSearchButton.addEventListener(
      "click",
      () => {

        if (searchInput) {

          searchInput.value = "";

          currentSearch = "";

          searchInput.focus();
        }

        filterProducts();
      }
    );
  }


  /* ========================================
     GUARDAR CARRITO
  ======================================== */

  function saveCart() {

    try {

      localStorage.setItem(
        "elDorsalCart",
        JSON.stringify(cart)
      );

    } catch (error) {

      console.error(
        "No se pudo guardar el carrito:",
        error
      );
    }
  }


  /* ========================================
     ABRIR / CERRAR CARRITO
  ======================================== */

  function openCart() {

    if (cartPanel) {

      cartPanel.classList.add(
        "active"
      );
    }

    createCartOverlay();
  }


  function closeCart() {

    if (cartPanel) {

      cartPanel.classList.remove(
        "active"
      );
    }

    removeCartOverlay();
  }


  if (cartButton) {

    cartButton.addEventListener(
      "click",
      openCart
    );
  }


  if (closeCartButton) {

    closeCartButton.addEventListener(
      "click",
      closeCart
    );
  }


  function createCartOverlay() {

    let overlay =
      document.querySelector(
        ".cart-overlay"
      );


    if (!overlay) {

      overlay =
        document.createElement(
          "div"
        );

      overlay.className =
        "cart-overlay";

      document.body.appendChild(
        overlay
      );


      overlay.addEventListener(
        "click",
        closeCart
      );
    }


    requestAnimationFrame(
      () => {

        overlay.classList.add(
          "active"
        );
      }
    );
  }


  function removeCartOverlay() {

    const overlay =
      document.querySelector(
        ".cart-overlay"
      );

    if (overlay) {

      overlay.classList.remove(
        "active"
      );
    }
  }


  /* ========================================
     PERSONALIZACIÓN
  ======================================== */

  function setupPersonalization() {

    const cards =
      getProductCards();


    cards.forEach((card) => {

      if (
        card.querySelector(
          ".personalization-options"
        )
      ) {
        return;
      }


      const addButton =
        card.querySelector(
          ".add-button"
        );


      if (!addButton) {
        return;
      }


      const productCategory =
        normalizeCategory(
          card.getAttribute(
            "data-category"
          ) || ""
        );


      const isConjunto =
        productCategory ===
        "conjuntos";


      const personalization =
        document.createElement(
          "div"
        );


      personalization.className =
        "personalization-options";


      personalization.innerHTML = `

        <div class="personalization-title">
          PERSONALIZA TU CAMISETA
        </div>

        <label>
          ¿Quieres poner nombre?
        </label>

        <select class="personalization-name">

          <option value="No">
            No
          </option>

          <option value="Sí">
            Sí
          </option>

        </select>

        <input
          type="text"
          class="player-name"
          placeholder="Escribe el nombre"
          maxlength="15"
          autocomplete="off"
          style="display:none;"
        >

        <label>
          ¿Quieres poner número?
        </label>

        <select class="personalization-number">

          <option value="No">
            No
          </option>

          <option value="Sí">
            Sí
          </option>

        </select>

        <input
          type="number"
          class="player-number"
          placeholder="Escribe el número"
          min="0"
          max="99"
          autocomplete="off"
          style="display:none;"
        >

        <label>
          ¿Quieres parches?
        </label>

        <select class="personalization-patches">

          <option value="No">
            No
          </option>

          <option value="Sí">
            Sí
          </option>

        </select>

      `;


      /* ========================================
         TALLA DE NIÑO
      ======================================== */

      if (isConjunto) {

        const sizeSelect =
          card.querySelector(
            ".size-select"
          );


        if (sizeSelect) {

          const childSizeBox =
            document.createElement(
              "div"
            );


          childSizeBox.className =
            "child-size-box";


          childSizeBox.innerHTML = `

            <label>
              Talla del niño
            </label>

            <input
              type="text"
              class="child-size-input"
              placeholder="Escribe la talla del niño"
              maxlength="10"
              autocomplete="off"
            >

            <small>
              (Si quieres un conjunto para tu hijo, escribe su talla)
            </small>

          `;


          sizeSelect.parentNode.insertBefore(
            childSizeBox,
            sizeSelect.nextSibling
          );
        }
      }


      addButton.parentNode.insertBefore(
        personalization,
        addButton
      );


      /* ========================================
         NOMBRE
      ======================================== */

      const nameOption =
        personalization.querySelector(
          ".personalization-name"
        );


      const nameInput =
        personalization.querySelector(
          ".player-name"
        );


      nameOption.addEventListener(
        "change",
        () => {

          if (
            nameOption.value ===
            "Sí"
          ) {

            nameInput.style.display =
              "block";

            nameInput.focus();

          } else {

            nameInput.style.display =
              "none";

            nameInput.value = "";
          }
        }
      );


      /* ========================================
         NÚMERO
      ======================================== */

      const numberOption =
        personalization.querySelector(
          ".personalization-number"
        );


      const numberInput =
        personalization.querySelector(
          ".player-number"
        );


      numberOption.addEventListener(
        "change",
        () => {

          if (
            numberOption.value ===
            "Sí"
          ) {

            numberInput.style.display =
              "block";

            numberInput.focus();

          } else {

            numberInput.style.display =
              "none";

            numberInput.value = "";
          }
        }
      );

    });
  }


  /* ========================================
     AÑADIR AL CARRITO
  ======================================== */

  function addToCart(card) {

    if (!card) {
      return;
    }


    const nameElement =
      card.querySelector(
        ".product-name"
      );


    const priceElement =
      card.querySelector(
        ".product-price"
      );


    const sizeSelect =
      card.querySelector(
        ".size-select"
      );


    const name =
      nameElement
        ? nameElement.textContent.trim()
        : "Camiseta";


    const priceText =
      priceElement
        ? priceElement.textContent
        : "0";


    let price =
      parseFloat(
        priceText
          .replace(/\s/g, "")
          .replace("€", "")
          .replace(",", ".")
      );


    if (isNaN(price)) {
      price = 0;
    }


    const size =
      sizeSelect
        ? sizeSelect.value
        : "Única";


    if (
      sizeSelect &&
      (
        size === "" ||
        normalizeText(size)
          .includes("seleccion")
      )
    ) {

      alert(
        "Selecciona una talla antes de añadir la camiseta."
      );

      return;
    }


    const productCategory =
      normalizeCategory(
        card.getAttribute(
          "data-category"
        ) || ""
      );


    const isConjunto =
      productCategory ===
      "conjuntos";


    let childSize = "";


    if (isConjunto) {

      const childSizeInput =
        card.querySelector(
          ".child-size-input"
        );


      if (childSizeInput) {

        childSize =
          childSizeInput.value.trim();


        if (
          childSize === ""
        ) {

          alert(
            "Escribe la talla del niño para el conjunto."
          );

          childSizeInput.focus();

          return;
        }
      }
    }


    /* ========================================
       PERSONALIZACIÓN
    ======================================== */

    const personalization =
      card.querySelector(
        ".personalization-options"
      );


    let wantsName = "No";
    let playerName = "";

    let wantsNumber = "No";
    let playerNumber = "";

    let wantsPatches = "No";


    if (personalization) {

      const nameOption =
        personalization.querySelector(
          ".personalization-name"
        );


      const nameInput =
        personalization.querySelector(
          ".player-name"
        );


      const numberOption =
        personalization.querySelector(
          ".personalization-number"
        );


      const numberInput =
        personalization.querySelector(
          ".player-number"
        );


      const patchesOption =
        personalization.querySelector(
          ".personalization-patches"
        );


      if (nameOption) {

        wantsName =
          nameOption.value;
      }


      if (
        wantsName === "Sí" &&
        nameInput
      ) {

        playerName =
          nameInput.value.trim();


        if (
          playerName === ""
        ) {

          alert(
            "Escribe el nombre que quieres poner en la camiseta."
          );

          nameInput.focus();

          return;
        }
      }


      if (numberOption) {

        wantsNumber =
          numberOption.value;
      }


      if (
        wantsNumber === "Sí" &&
        numberInput
      ) {

        playerNumber =
          numberInput.value.trim();


        if (
          playerNumber === ""
        ) {

          alert(
            "Escribe el número que quieres poner en la camiseta."
          );

          numberInput.focus();

          return;
        }
      }


      if (patchesOption) {

        wantsPatches =
          patchesOption.value;
      }
    }


    const productId =
      `${normalizeText(name)}-${normalizeText(size)}-${normalizeText(childSize)}-${normalizeText(playerName)}-${playerNumber}-${normalizeText(wantsPatches)}`;


    const existingProduct =
      cart.find(
        item =>
          item.id === productId
      );


    if (existingProduct) {

      existingProduct.quantity += 1;

    } else {

      cart.push({

        id: productId,

        name: name,

        price: price,

        size: size,

        childSize: childSize,

        wantsName: wantsName,

        playerName: playerName,

        wantsNumber: wantsNumber,

        playerNumber: playerNumber,

        wantsPatches: wantsPatches,

        quantity: 1
      });
    }


    saveCart();

    updateCart();

    openCart();
  }


  /* ========================================
     BOTONES AÑADIR
  ======================================== */

  function setupProductButtons() {

    const cards =
      getProductCards();


    cards.forEach((card) => {

      const addButton =
        card.querySelector(
          ".add-button"
        );


      if (
        addButton &&
        !addButton.dataset.ready
      ) {

        addButton.dataset.ready =
          "true";


        addButton.addEventListener(
          "click",
          () => {

            addToCart(card);
          }
        );
      }
    });
  }


  /* ========================================
     ELIMINAR
  ======================================== */

  function removeFromCart(
    productId
  ) {

    cart =
      cart.filter(
        item =>
          item.id !== productId
      );

    saveCart();

    updateCart();
  }


  /* ========================================
     CANTIDAD
  ======================================== */

  function changeQuantity(
    productId,
    change
  ) {

    const product =
      cart.find(
        item =>
          item.id === productId
      );


    if (!product) {
      return;
    }


    product.quantity +=
      change;


    if (
      product.quantity <= 0
    ) {

      removeFromCart(
        productId
      );

      return;
    }


    saveCart();

    updateCart();
  }


  /* ========================================
     ACTUALIZAR CARRITO
  ======================================== */

  function updateCart() {

    if (!cartProducts) {
      return;
    }


    cartProducts.innerHTML = "";


    if (cart.length === 0) {

      const emptyMessage =
        document.createElement(
          "p"
        );


      emptyMessage.textContent =
        "Tu carrito está vacío.";


      emptyMessage.style.color =
        "#777";


      cartProducts.appendChild(
        emptyMessage
      );
    }


    cart.forEach((product) => {

      const cartItem =
        document.createElement(
          "div"
        );


      cartItem.className =
        "cart-item";


      const itemInfo =
        document.createElement(
          "div"
        );


      itemInfo.className =
        "cart-item-info";


      const itemName =
        document.createElement(
          "div"
        );


      itemName.className =
        "cart-item-name";


      itemName.textContent =
        product.name;


      const itemSize =
        document.createElement(
          "div"
        );


      itemSize.className =
        "cart-item-price";


      itemSize.textContent =
        `Talla: ${product.size}`;


      if (product.childSize) {

        const childSizeElement =
          document.createElement(
            "div"
          );


        childSizeElement.className =
          "cart-item-price";


        childSizeElement.textContent =
          `Talla niño: ${product.childSize}`;


        itemInfo.appendChild(
          childSizeElement
        );
      }


      if (
        product.wantsName === "Sí" &&
        product.playerName
      ) {

        const personalizationName =
          document.createElement(
            "div"
          );


        personalizationName.className =
          "cart-item-price";


        personalizationName.textContent =
          `Nombre: ${product.playerName}`;


        itemInfo.appendChild(
          personalizationName
        );
      }


      if (
        product.wantsNumber === "Sí" &&
        product.playerNumber !== ""
      ) {

        const personalizationNumber =
          document.createElement(
            "div"
          );


        personalizationNumber.className =
          "cart-item-price";


        personalizationNumber.textContent =
          `Número: ${product.playerNumber}`;


        itemInfo.appendChild(
          personalizationNumber
        );
      }


      if (
        product.wantsPatches === "Sí"
      ) {

        const personalizationPatches =
          document.createElement(
            "div"
          );


        personalizationPatches.className =
          "cart-item-price";


        personalizationPatches.textContent =
          "Parches: Sí";


        itemInfo.appendChild(
          personalizationPatches
        );
      }


      const itemPrice =
        document.createElement(
          "div"
        );


      itemPrice.className =
        "cart-item-price";


      itemPrice.textContent =
        `${Number(product.price).toFixed(2)} €`;


      const quantityControls =
        document.createElement(
          "div"
        );


      quantityControls.className =
        "cart-quantity";


      const minusButton =
        document.createElement(
          "button"
        );


      minusButton.type =
        "button";


      minusButton.className =
        "quantity-button";


      minusButton.textContent =
        "−";


      const quantityNumber =
        document.createElement(
          "span"
        );


      quantityNumber.className =
        "quantity-number";


      quantityNumber.textContent =
        product.quantity;


      const plusButton =
        document.createElement(
          "button"
        );


      plusButton.type =
        "button";


      plusButton.className =
        "quantity-button";


      plusButton.textContent =
        "+";


      minusButton.addEventListener(
        "click",
        () => {

          changeQuantity(
            product.id,
            -1
          );
        }
      );


      plusButton.addEventListener(
        "click",
        () => {

          changeQuantity(
            product.id,
            1
          );
        }
      );


      quantityControls.appendChild(
        minusButton
      );

      quantityControls.appendChild(
        quantityNumber
      );

      quantityControls.appendChild(
        plusButton
      );


      const subtotal =
        document.createElement(
          "div"
        );


      subtotal.className =
        "cart-item-price";


      subtotal.textContent =
        `Subtotal: ${(
          Number(product.price) *
          product.quantity
        ).toFixed(2)} €`;


      const removeButton =
        document.createElement(
          "button"
        );


      removeButton.type =
        "button";


      removeButton.className =
        "remove-item";


      removeButton.textContent =
        "Eliminar";


      removeButton.addEventListener(
        "click",
        () => {

          removeFromCart(
            product.id
          );
        }
      );


      itemInfo.appendChild(
        itemName
      );

      itemInfo.appendChild(
        itemSize
      );

      itemInfo.appendChild(
        itemPrice
      );

      itemInfo.appendChild(
        quantityControls
      );

      itemInfo.appendChild(
        subtotal
      );


      cartItem.appendChild(
        itemInfo
      );

      cartItem.appendChild(
        removeButton
      );


      cartProducts.appendChild(
        cartItem
      );
    });


    const total =
      cart.reduce(
        (sum, product) =>
          sum +
          Number(product.price) *
          product.quantity,
        0
      );


    if (cartTotal) {

      cartTotal.textContent =
        `Total: ${total.toFixed(2)} €`;
    }


    if (cartButton) {

      const totalItems =
        cart.reduce(
          (sum, product) =>
            sum +
            product.quantity,
          0
        );


      cartButton.textContent =
        `🛒 Carrito (${totalItems})`;
    }
  }


  /* ========================================
     PREPARAR PEDIDO
  ======================================== */

  function createOrderText() {

    let orderText = "";

    cart.forEach((product, index) => {

      orderText +=
        `PRODUCTO ${index + 1}\n`;

      orderText +=
        `Camiseta: ${product.name}\n`;

      orderText +=
        `Talla: ${product.size}\n`;

      if (product.childSize) {

        orderText +=
          `Talla niño: ${product.childSize}\n`;
      }

      orderText +=
        `Cantidad: ${product.quantity}\n`;

      orderText +=
        `Precio unidad: ${Number(product.price).toFixed(2)} €\n`;

      orderText +=
        `Subtotal: ${(Number(product.price) * product.quantity).toFixed(2)} €\n`;

      orderText +=
        `Nombre: ${
          product.wantsName === "Sí"
            ? product.playerName
            : "No"
        }\n`;

      orderText +=
        `Número: ${
          product.wantsNumber === "Sí"
            ? product.playerNumber
            : "No"
        }\n`;

      orderText +=
        `Parches: ${product.wantsPatches || "No"}\n`;

      orderText +=
        `------------------------------\n`;
    });


    const total =
      cart.reduce(
        (sum, product) =>
          sum +
          Number(product.price) *
          product.quantity,
        0
      );


    orderText +=
      `TOTAL DEL PEDIDO: ${total.toFixed(2)} €`;


    return orderText;
  }


  /* ========================================
     DATOS DEL CLIENTE
  ======================================== */

  function showCustomerForm() {

    if (!cartPanel) {
      return;
    }


    /* Si ya existe, no crear otro */

    const oldForm =
      cartPanel.querySelector(
        ".customer-checkout"
      );


    if (oldForm) {
      oldForm.remove();
    }


    const checkoutForm =
      document.createElement(
        "div"
      );


    checkoutForm.className =
      "customer-checkout";


    checkoutForm.innerHTML = `

      <h2>
        DATOS DEL PEDIDO
      </h2>

      <p>
        Introduce tus datos para que podamos ponernos en contacto contigo y finalizar tu pedido.
      </p>

      <form
        action="https://formspree.io/f/mwlknzdl"
        method="POST"
        class="customer-form"
      >

        <input
          type="hidden"
          name="_subject"
          value="Nuevo pedido - EL DORSAL"
        >

        <input
          type="hidden"
          name="pedido"
          class="order-details"
        >

        <input
          type="hidden"
          name="total"
          class="order-total"
        >


        <label>
          Nombre
        </label>

        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          required
        >


        <label>
          Apellidos
        </label>

        <input
          type="text"
          name="apellidos"
          placeholder="Tus apellidos"
          required
        >


        <label>
          Teléfono
        </label>

        <input
          type="tel"
          name="telefono"
          placeholder="Tu teléfono"
          required
        >


        <label>
          Email
        </label>

        <input
          type="email"
          name="email"
          placeholder="Tu email"
          required
        >


        <label>
          Dirección
        </label>

        <input
          type="text"
          name="direccion"
          placeholder="Calle, número, piso..."
          required
        >


        <label>
          Código postal
        </label>

        <input
          type="text"
          name="codigo_postal"
          placeholder="Código postal"
          required
        >


        <label>
          Ciudad
        </label>

        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          required
        >


        <label>
          Observaciones
        </label>

        <textarea
          name="observaciones"
          placeholder="¿Quieres añadir alguna indicación sobre tu pedido?"
          rows="4"
        ></textarea>


        <div class="checkout-form-buttons">

          <button
            type="button"
            class="back-to-cart"
          >
            VOLVER AL CARRITO
          </button>


          <button
            type="submit"
            class="send-order-button"
          >
            ENVIAR PEDIDO
          </button>

        </div>

      </form>

    `;


    cartPanel.appendChild(
      checkoutForm
    );


    /* ========================================
       RELLENAR PEDIDO Y TOTAL
    ======================================== */

    const form =
      checkoutForm.querySelector(
        ".customer-form"
      );


    const orderDetails =
      checkoutForm.querySelector(
        ".order-details"
      );


    const orderTotal =
      checkoutForm.querySelector(
        ".order-total"
      );


    const total =
      cart.reduce(
        (sum, product) =>
          sum +
          Number(product.price) *
          product.quantity,
        0
      );


    orderDetails.value =
      createOrderText();


    orderTotal.value =
      `${total.toFixed(2)} €`;


    /* ========================================
       VOLVER AL CARRITO
    ======================================== */

    const backButton =
      checkoutForm.querySelector(
        ".back-to-cart"
      );


    if (backButton) {

      backButton.addEventListener(
        "click",
        () => {

          checkoutForm.remove();


          if (cartProducts) {

            cartProducts.style.display =
              "";
          }


          if (cartTotal) {

            cartTotal.style.display =
              "";
          }


          if (checkoutButton) {

            checkoutButton.style.display =
              "";
          }


          if (closeCartButton) {

            closeCartButton.style.display =
              "";
          }
        }
      );
    }


    /* ========================================
       ANTES DE ENVIAR
    ======================================== */

    form.addEventListener(
      "submit",
      () => {

        orderDetails.value =
          createOrderText();

        orderTotal.value =
          `${total.toFixed(2)} €`;

        /*
          IMPORTANTE:
          No usamos preventDefault().
          El formulario se envía directamente
          a Formspree.
        */
      }
    );
  }


  /* ========================================
     FINALIZAR PEDIDO
  ======================================== */

  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      () => {

        if (cart.length === 0) {

          alert(
            "Tu carrito está vacío."
          );

          return;
        }


        /* Ocultar carrito */

        if (cartProducts) {

          cartProducts.style.display =
            "none";
        }


        if (cartTotal) {

          cartTotal.style.display =
            "none";
        }


        checkoutButton.style.display =
          "none";


        if (closeCartButton) {

          closeCartButton.style.display =
            "none";
        }


        showCustomerForm();
      }
    );
  }


  /* ========================================
     ESCAPE
  ======================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        cartPanel &&
        cartPanel.classList.contains(
          "active"
        )
      ) {

        closeCart();
      }
    }
  );


  /* ========================================
     BOTÓN TODOS
  ======================================== */

  const allButton =
    document.querySelector(
      '.category-button[data-category="all"]'
    );


  if (allButton) {

    categoryButtons.forEach(
      (button) => {

        button.classList.remove(
          "active"
        );
      }
    );


    allButton.classList.add(
      "active"
    );


    currentCategory =
      "all";
  }


  /* ========================================
     INICIAR
  ======================================== */

  setupPersonalization();

  setupProductButtons();

  filterProducts();

  updateCart();


  console.log(
    "EL DORSAL iniciado correctamente."
  );

  console.log(
    "Número de productos:",
    getProductCards().length
  );

  console.log(
    "Productos de CONJUNTOS:",
    document.querySelectorAll(
      "#conjuntos .product-card"
    ).length
  );

});