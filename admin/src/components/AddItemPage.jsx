import React, { useRef, useState } from "react";
import { addItemPageStyles as styles } from "../assets/adminStyles";
import axios from "axios";
import { FiSave, FiUpload, FiX } from "react-icons/fi";

const initialFormState = {
  name: "",
  description: "",
  category: "",
  oldPrice: "",
  price: "",
  image: null,
  preview: "",
};

const categories = [
  "Fruits",
  "Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Pantry",
];

const AddItemPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((f) => ({
      ...f,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const removeImage = () => {
    setFormData((f) => ({ ...f, image: null, preview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "preview" && value) body.append(key, value);
      });

      const res = await axios.post(
        "https://rushbasket-grocery-websites-backend.onrender.com/api/items",
        body,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Product added successfully!");
      console.log("Created:", res.data);

      // Reset
      setFormData(initialFormState);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check backend console for the error.");
    }
  };

  const { name, description, category, oldPrice, price, preview } = formData;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.heading}>Add New Product</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.gridContainer}>
            <div>
              <label className={styles.label}>Product Name *</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Category *</label>
              <select
                name="category"
                value={category}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              rows="3"
              className={styles.textarea}
            />
          </div>

          <div className={styles.priceGrid}>
            <div>
              <label className={styles.label}>Original Price(₹) *</label>
              <input
                type="number"
                name="oldPrice"
                value={oldPrice}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Selling Price(₹) *</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={styles.label}>Product Image</label>
            <div
              onClick={() => fileInputRef.current.click()}
              className={styles.imageUploadContainer}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className={styles.previewImage} />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={styles.removeButton}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <FiUpload className={styles.uploadIcon} />
                  <p className={styles.uploadText}>Click to upload image</p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className={styles.hiddenInput}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            <FiSave className="mr-2" />
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemPage;

