import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import { itemsPageStyles } from "../assets/dummyStyles";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiMinus,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:4000";

/*  DEFAULT FALLBACK DATA (used before API loads or if API fails) */
const groceryData = [
  {
    id: "Fruits",
    name: "Fruits",
    items: [
      {
        _id: "1",
        name: "Apple",
        price: 120,
        description: "Fresh organic apples",
        category: "Fruits",
        image: "/uploads/apple.jpg",
      },
      {
        _id: "2",
        name: "Banana",
        price: 60,
        description: "Sweet ripe bananas",
        category: "Fruits",
        image: "/uploads/banana.jpg",
      },
    ],
  },
  {
    id: "Vegetables",
    name: "Vegetables",
    items: [
      {
        _id: "3",
        name: "Tomato",
        price: 40,
        description: "Farm fresh tomatoes",
        category: "Vegetables",
        image: "/uploads/tomato.jpg",
      },
    ],
  },
];

/* ------------------------------------------------------------------
   PRODUCT CARD
------------------------------------------------------------------ */
const ProductCard = ({ item }) => {
  const { addToCart, cart, removeFromCart, updateQuantity } = useCart();
  const productId = item._id;

  const cartItem = cart.find((ci) => ci.productId === productId);
  const lineId = cartItem?.id;
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => addToCart(productId, 1);
  const handleIncrement = () => updateQuantity(lineId, quantity + 1);

  const handleDecrement = () => {
    if (quantity <= 1) removeFromCart(lineId);
    else updateQuantity(lineId, quantity - 1);
  };

  const rawImage = item.image || item.imageUrl;
  let imgSrc = item.image;
  if (rawImage) {
    if (rawImage.startsWith("http")) imgSrc = rawImage;
    else if (rawImage.startsWith("/")) imgSrc = `${BACKEND_URL}${rawImage}`;
    else imgSrc = `${BACKEND_URL}/uploads/${rawImage}`;
  }

  return (
    <div className={itemsPageStyles.productCard}>
      <div className={itemsPageStyles.imageContainer}>
        <img
          src={imgSrc}
          alt={item.name}
          className={itemsPageStyles.productImage}
        />
      </div>

      <div className={itemsPageStyles.cardContent}>
        <div className={itemsPageStyles.titleContainer}>
          <h3 className={itemsPageStyles.productTitle}>{item.name}</h3>
          <span className={itemsPageStyles.organicTag}>Organic</span>
        </div>

        <p className={itemsPageStyles.productDescription}>
          {item.description ||
            `Fresh organic ${item.name.toLowerCase()} sourced locally`}
        </p>

        <div className={itemsPageStyles.priceContainer}>
          <span className={itemsPageStyles.currentPrice}>
            ₹{item.price.toFixed(2)}
          </span>
          <span className={itemsPageStyles.oldPrice}>
            ₹{(item.price * 1.15).toFixed(2)}
          </span>
        </div>

        <div className="mt-3">
          {quantity > 0 ? (
            <div className={itemsPageStyles.quantityControls}>
              <button
                onClick={handleDecrement}
                className={`${itemsPageStyles.quantityButton} ${itemsPageStyles.quantityButtonLeft}`}
              >
                <FiMinus />
              </button>

              <span className={itemsPageStyles.quantityValue}>{quantity}</span>

              <button
                onClick={handleIncrement}
                className={`${itemsPageStyles.quantityButton} ${itemsPageStyles.quantityButtonRight}`}
              >
                <FiPlus />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={itemsPageStyles.addButton}
            >
              <span>Add to Cart</span>
              <span className={itemsPageStyles.addButtonArrow}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/*  MAIN ITEM PAGE*/
const Item = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [data, setData] = useState(groceryData); // ✅ FIXED

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) setSearchTerm(search);
  }, [location]);

  // Fetch Items from Backend
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/items`)
      .then((res) => {
        const products = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        const grouped = products.reduce((acc, item) => {
          const cat = item.category || "Uncategorized";
          if (!acc[cat]) acc[cat] = { id: cat, name: cat, items: [] };
          acc[cat].items.push(item);
          return acc;
        }, {});

        setData(Object.values(grouped));
      })
      .catch(() => console.error("Error fetching items"));
  }, []);

  // Search Filter
  const itemMatchesSearch = (item, term) => {
    if (!term) return true;
    const words = term.trim().toLowerCase().split(/\s+/);
    return words.every((w) => item.name.toLowerCase().includes(w));
  };

  const filterData = searchTerm
    ? data
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            itemMatchesSearch(item, searchTerm)
          ),
        }))
        .filter((category) => category.items.length > 0)
    : data;

  const clearSearch = () => {
    setSearchTerm("");
    navigate("/items");
  };

  const toggleCategory = (id) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllCategories = () => {
    if (allExpanded) setExpandedCategories({});
    else {
      const expanded = {};
      data.forEach((c) => (expanded[c.id] = true));
      setExpandedCategories(expanded);
    }
    setAllExpanded(!allExpanded);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim())
      navigate(`/items?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className={itemsPageStyles.page}>
      <div className={itemsPageStyles.container}>
        {/* Header */}
        <header className={itemsPageStyles.header}>
          <Link to="/" className={itemsPageStyles.backLink}>
            <FiArrowLeft className="mr-2" />
            <span>Back</span>
          </Link>

          <h1 className={itemsPageStyles.mainTitle}>
            <span className={itemsPageStyles.titleSpan}>ORGANIC</span> PANTRY
          </h1>

          <p className={itemsPageStyles.subtitle}>
            Premium quality groceries from local organic farms
          </p>

          <div className={itemsPageStyles.titleDivider}>
            <div className={itemsPageStyles.dividerLine} />
          </div>
        </header>

        {/* Search */}
        <div className={itemsPageStyles.searchContainer}>
          <form
            onSubmit={handleSearchSubmit}
            className={itemsPageStyles.searchForm}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fruits, vegetables, meats..."
              className={itemsPageStyles.searchInput}
            />
            <button type="submit" className={itemsPageStyles.searchButton}>
              <FiSearch />
            </button>
          </form>
        </div>

        {/* Expand All */}
        <div className="flex justify-center mb-10">
          <button
            onClick={toggleAllCategories}
            className={itemsPageStyles.expandButton}
          >
            <span className="mr-2 font-medium">
              {allExpanded ? "Collapse All" : "Expand All"}
            </span>
            {allExpanded ? <FiMinus /> : <FiPlus />}
          </button>
        </div>

        {/* Categories & Products */}
        {filterData.length > 0 ? (
          filterData.map((category) => {
            const isExpanded = expandedCategories[category.id] || allExpanded;
            const visibleItems = isExpanded
              ? category.items
              : category.items.slice(0, 4);
            const hasMore = category.items.length > 4;

            return (
              <section
                key={category.id}
                className={itemsPageStyles.categorySection}
              >
                <div className={itemsPageStyles.categoryHeader}>
                  <div className={itemsPageStyles.categoryIcon}></div>
                  <h2 className={itemsPageStyles.categoryTitle}>
                    {category.name}
                  </h2>
                  <div className={itemsPageStyles.categoryDivider}></div>
                </div>

                <div className={itemsPageStyles.productsGrid}>
                  {visibleItems.map((item) => (
                    <ProductCard key={item._id} item={item} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={itemsPageStyles.showMoreButton}
                    >
                      <span className="mr-2 font-medium">
                        {isExpanded
                          ? `Show Less ${category.name}`
                          : `Show More ${category.name} (${
                              category.items.length - 4
                            }+)`}
                      </span>
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                )}
              </section>
            );
          })
        ) : (
          <div className={itemsPageStyles.noProductsContainer}>
            <div className={itemsPageStyles.noProductsCard}>
              <div className={itemsPageStyles.noProductsIcon}>
                <FiSearch className="mx-auto h-16 w-16" />
              </div>
              <h3 className={itemsPageStyles.noProductsTitle}>
                No Products Found
              </h3>
              <p className={itemsPageStyles.noProductsText}>
                We couldn't find any items matching "{searchTerm}"
              </p>
              <button
                onClick={clearSearch}
                className={itemsPageStyles.clearSearchButton}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
