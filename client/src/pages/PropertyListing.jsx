import {useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function PropertyListing() {
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    type: "rent",
    bedRooms: 0,
    bathRooms: 0,
    regularPrice: 1000,
    discountPrice: 0,
    kitchen: false,
    hall: false,
    parking: false,
    furnished: false,
  });
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUploads = async (e) => {
    if (files.length === 0)
      return setFileUploadError("Please upload at least one image");
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setFileUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setFileUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setFileUploadError("Image files size should be less than 2 Mb");
          setUploading(false);
        });
    } else {
      setFileUploadError("Only a maximum of 6 images are allowed");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: You can track the progress of the upload here
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const deleteUploadImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, id) => id !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({
        ...formData,
        type: id,
      });
    } else if (["text", "textarea", "number"].includes(e.target.type)) {
      setFormData({ ...formData, [id]: value });
    } else if (
      ["parking", "furnished", "hall", "kitchen", "offer"].includes(id)
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: checked,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("Please upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be less than Regular price");

      setLoading(true);
      setError(false);

      const res = await fetch("/api/properties/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Failed to add property");
      } else {
        navigate(`/properties/${data._id}`);
      }
    } catch (error) {
      setError(error.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 mt-10">
      <h1 className="text-3xl font-semibold my-4 mb-8 text-center">
        Add Property Details
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-8">
        <div className="flex-1 w-full md:w-1/2 space-y-4">
          <input
            type="text"
            id="name"
            required
            placeholder="Name"
            className="border p-3 rounded-lg w-full"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            id="description"
            required
            placeholder="Description"
            className="border rounded-lg w-full h-32 p-3"
            onChange={handleChange}
            value={formData.description}
          />
          <div className="flex gap-4 items-center w-full">
            <input
              type="text"
              id="address"
              required
              placeholder="Address"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.address}
            />
            <input
              type="text"
              id="city"
              required
              placeholder="City"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.city}
            />
            <input
              type="text"
              id="state"
              required
              placeholder="State"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.state}
            />
            <input
              type="number"
              id="zip"
              required
              placeholder="Pincode"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              value={formData.zip}
            />
          </div>
        </div>

        <div className=" flex-1 w-full md:w-1/2 space-y-4">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                id="sale"
                className="mr-2"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              Sale
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                id="rent"
                className="mr-2"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              Rent
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                id="parking"
                className="mr-2"
                onChange={handleChange}
                checked={formData.parking}
              />
              Parking Spot
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                id="furnished"
                className="mr-2"
                onChange={handleChange}
                checked={formData.furnished}
              />
              Furnished
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                id="offer"
                className="mr-2"
                onChange={handleChange}
                checked={formData.offer}
              />
              Offer
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                id="kitchen"
                className="mr-2"
                onChange={handleChange}
                checked={formData.kitchen}
              />
              Kitchen
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                id="hall"
                className="mr-2"
                onChange={handleChange}
                checked={formData.hall}
              />
              Hall
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <span className="w-24 text-right">Bed Rooms:</span>
              <input
                type="number"
                id="bedRooms"
                min="1"
                max="10"
                className="border w-16 p-2"
                onChange={handleChange}
                value={formData.bedRooms}
              />
            </label>
            <label className="flex items-center">
              <span className="w-24 text-right">Bath Rooms:</span>
              <input
                type="number"
                id="bathRooms"
                min="1"
                max="10"
                className="border w-16 p-2"
                onChange={handleChange}
                value={formData.bathRooms}
              />
            </label>
            <label className="flex items-center">
              <span className="w-24 text-right">Regular Price (₹/month):</span>
              <input
                type="number"
                id="regularPrice"
                min="1000"
                max="1000000"
                className="border w-32 p-2"
                onChange={handleChange}
                value={formData.regularPrice}
              />
            </label>
            {formData.offer && (
              <label className="flex items-center">
                <span className="w-24 text-right">Discounted Price:</span>
                <input
                  type="number"
                  id="discountPrice"
                  min="500"
                  max="100000"
                  className="border w-32 p-2"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-semibold">
              Images: the first image is the cover (max 6)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="image"
                className="border p-2"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleUploads}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {formData.imageUrls.map((url, index) => (
              <div key={url} className="flex items-center gap-4">
                <img
                  src={url}
                  alt={`Property Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                  onClick={() => deleteUploadImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}

            {fileUploadError && (
              <p className="text-red-700">{fileUploadError}</p>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 w-full rounded-lg"
            >
              {loading ? "Adding..." : "Add Property"}
            </button>

            {error && <p className="text-red-700">{error}</p>}
          </div>
        </div>
      </form>
    </main>
  );
}
