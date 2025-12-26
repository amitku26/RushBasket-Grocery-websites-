// import React, { useRef, useState } from "react";
// import { addItemPageStyles as styles } from "../assets/adminStyles";
// import axios from "axios";
// import { FiSave, FiUpload, FiX } from "react-icons/fi";

// const initialFormState = {
//   name: "",
//   description: "",
//   category: "",
//   oldPrice: "",
//   price: "",
//   image: null,
//   preview: "",
// };

// const categories = [
//   "Fruits",
//   "Vegetables",
//   "Dairy & Eggs",
//   "Meat & Seafood",
//   "Bakery",
//   "Pantry",
// ];

// const AddItemPage = () => {
//   const [formData, setFormData] = useState(initialFormState);
//   const fileInputRef = useRef();

//   const handleChange = (e) => {
//     setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
//   };

//   const handleImageUpload = (e) => {
//     console.log("called");
//     e.preventDefault();
//     const file = e.target.files[0];
//     console.log(file);
//     if (!file) return;

//     setFormData((f) => ({
//       ...f,
//       image: file,
//       preview: URL.createObjectURL(file),
//     }));
//     const data = new FormData();
//     data.append("file", file);
//     data.append("upload_preset", "chat-app");
//     data.append("cloud_name", "dfekugfbo");
//     fetch("https://api.cloudinary.com/v1_1/dfekugfbo/image/upload", {
//       method: "post",
//       body: data,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setFormData({ ...formData, image: data.url.toString() });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const removeImage = () => {
//     setFormData((f) => ({ ...f, image: null, preview: "" }));
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // const body = new FormData();
//       // Object.entries(formData).forEach(([key, value]) => {
//       //   if (key !== "preview" && value) body.append(key, value);
//       // });

//       console.log(formData);
//       const res = await axios.post(
//         // "https://rushbasket-grocery-websites-backend.onrender.com/api/items",
//         "http://localhost:4000/",
//         formData,
//         { headers: { "Content-Type": "application/json" } }
//         // body
//         // { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       alert("Product added successfully!");
//       console.log("Created:", res.data);

//       // Reset
//       setFormData(initialFormState);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Upload failed. Check backend console for the error.");
//     }
//   };

//   const { name, description, category, oldPrice, price, preview } = formData;

//   return (
//     <div className={styles.pageContainer}>
//       <div className={styles.innerContainer}>
//         <h1 className={styles.heading}>Add New Product</h1>

//         <form className={styles.form} onSubmit={handleSubmit}>
//           <div className={styles.gridContainer}>
//             <div>
//               <label className={styles.label}>Product Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={name}
//                 onChange={handleChange}
//                 required
//                 className={styles.input}
//               />
//             </div>

//             <div>
//               <label className={styles.label}>Category *</label>
//               <select
//                 name="category"
//                 value={category}
//                 onChange={handleChange}
//                 required
//                 className={styles.input}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className={styles.label}>Description</label>
//             <textarea
//               name="description"
//               value={description}
//               onChange={handleChange}
//               rows="3"
//               className={styles.textarea}
//             />
//           </div>

//           <div className={styles.priceGrid}>
//             <div>
//               <label className={styles.label}>Original Price(₹) *</label>
//               <input
//                 type="number"
//                 name="oldPrice"
//                 value={oldPrice}
//                 onChange={handleChange}
//                 required
//                 className={styles.input}
//               />
//             </div>

//             <div>
//               <label className={styles.label}>Selling Price(₹) *</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={price}
//                 onChange={handleChange}
//                 required
//                 className={styles.input}
//               />
//             </div>
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className={styles.label}>Product Image</label>
//             <div
//               onClick={() => fileInputRef.current.click()}
//               className={styles.imageUploadContainer}
//             >
//               {preview ? (
//                 <div className="relative">
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className={styles.previewImage}
//                   />
//                   <button
//                     type="button"
//                     onClick={removeImage}
//                     className={styles.removeButton}
//                   >
//                     <FiX size={16} />
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <FiUpload className={styles.uploadIcon} />
//                   <p className={styles.uploadText}>Click to upload image</p>
//                 </>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleImageUpload}
//                 className={styles.hiddenInput}
//               />
//             </div>
//           </div>

//           <button type="submit" className={styles.submitButton}>
//             <FiSave className="mr-2" />
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddItemPage;


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
  image: "",
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set image preview
    setFormData((prev) => ({
      ...prev,
      preview: URL.createObjectURL(file),
    }));

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dfekugfbo");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfekugfbo/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await res.json();

      // Update state safely
      setFormData((prev) => ({
        ...prev,
        image: cloudData.secure_url, // Use secure_url
      }));
    } catch (error) {
      console.log("Cloudinary error:", error);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "", preview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        oldPrice: formData.oldPrice,
        price: formData.price,
        image: formData.image,
      };

      const res = await axios.post("http://localhost:4000/api/items", body, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Product added successfully!");
      setFormData(initialFormState);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check backend logs.");
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
                  <img
                    src={preview}
                    alt="Preview"
                    className={styles.previewImage}
                  />
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
