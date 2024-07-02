import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatePropertyInfo() {
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
    regularPrice: 0,
    discountPrice: 0,
    bathRooms: 0,
    bedRooms: 0,
    kitchen: false,
    hall: false,
    parking: false,
    furnished: false,
    type: "rent",
    offers: true,
  });
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploading, setUloading] = useState(false);
  const params = useParams();
  // console.log(files);
  // console.log(formData);

  useEffect(() => {
    const fetchPropertyInfo = async () => {
      try {
        const res = await fetch(`/api/properties/get/${params.propertyid}`);
        const data = await res.json();

        if (data.success === false) {
          // console.log(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchPropertyInfo();
  }, [params.id]);

  const handleUploads = async (e) => {
    if (files.length === 0)
      return setFileUploadError("please upload atleast one image");
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUloading(true);
      setFileUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      // console.log(promises);
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setFileUploadError(false);
          setUloading(false);
        })
        .catch((error) => {
          setFileUploadError("Image files size should be less than 2 Mb");
          setUloading(false);
        });
    } else {
      setFileUploadError("Only maximum 6 images are allowed");
      setUloading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      // console.log(fileName);
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
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "hall" ||
      e.target.id === "kitchen" ||
      e.target.id == "offers"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("upload one image must");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be less than Regular price");

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/properties/update/${params.propertyid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();

     
      // console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
      }
      navigate(`/properties/${params.propertyid}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto ">
      <h1 className=" text-3xl font-semibold my-4 mb-10 text-center">
        Update Property Details
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-10"
      >
        {/* /* right side */}
        <div className="flex flex-col gap-4 flex-1">
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
            type="text"
            id="description"
            required
            placeholder="Description"
            className="border rounded-lg  w-full mt-2  h-20 p-2"
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            required
            placeholder="Address"
            className="border p-3 rounded-lg w-full my-2"
            onChange={handleChange}
            value={formData.address}
          />
          {/* //left side  */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <label htmlFor="sale">
                <input
                  type="checkbox"
                  name="sale"
                  id="sale"
                  className="mr-2"
                  onChange={handleChange}
                  value={formData.type}
                />
                Sale
              </label>

              <label htmlFor="rent">
                <input
                  type="checkbox"
                  name="rent"
                  id="rent"
                  className="mr-2"
                  onChange={handleChange}
                  value={formData.type}
                />
                Rent
              </label>

              <label htmlFor="parking">
                <input
                  type="checkbox"
                  name="parking"
                  id="parking"
                  className="mr-2"
                  onChange={handleChange}
                  value={formData.parking}
                />
                Parking Spot
              </label>

              <label htmlFor="furnished">
                <input
                  type="checkbox"
                  name="furnished"
                  id="furnished"
                  className="mr-2"
                  onChange={handleChange}
                  value={formData.furnished}
                />
                Furnished
              </label>

              <label htmlFor="offers">
                <input
                  type="checkbox"
                  name="offers"
                  id="offers"
                  className="mr-2"
                  onChange={handleChange}
                  value={formData.offers}
                />
                Offers
              </label>

              <label htmlFor="kitchen">
                <input
                  type="checkbox"
                  name="kitchen"
                  id="kitchen"
                  className="mr-2"
                  onChange={handleChange}
                  value={formData.kitchen}
                />
                Kitchen
              </label>

              <label htmlFor="hall">
                <input
                  type="checkbox"
                  name="hall"
                  id="hall"
                  className="mr-2"
                  onChange={handleChange}
                  value={formData.hall}
                />
                Hall
              </label>
            </div>

            <div className="flex flex-wrap gap-6">
              <label htmlFor="bedRooms">
                <input
                  type="number"
                  name="bedRooms"
                  id="bedRooms"
                  min="1"
                  max="10"
                  className="border w-10 h-10 mr-1"
                  onChange={handleChange}
                  value={formData.bedRooms}
                />
                Bed Rooms
              </label>

              <label htmlFor="bathRooms">
                <input
                  type="number"
                  name="bathRooms"
                  id="bathRooms"
                  min="1"
                  max="10"
                  className="border w-10 h-10 mr-1"
                  onChange={handleChange}
                  value={formData.bathRooms}
                />
                Bath Rooms
              </label>

              <label htmlFor="regularPrice">
                <input
                  type="number"
                  name="regularPrice"
                  id="regularPrice"
                  min="1000"
                  max="1000000"
                  className="border w-20 h-10 mr-1 p-2"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                Regular Price (₹/months)
              </label>
              {formData.offers && (
                <label htmlFor="discountPrice">
                  <input
                    type="number"
                    name="discountPrice"
                    id="discountPrice"
                    min="500"
                    max="100000"
                    className="border w-20 h-10 mr-1 p-2"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  Discounted Price
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-5">
          <p className="">
            <span className="font-extrabold ">Images: </span>the first image is
            the cover(max 6)
          </p>
          <div className="flex gap-max">
            <input
              type="file"
              id="image"
              className="my-2 border p-2"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
            ></input>
            <button
              type="button"
              disabled={uploading}
              onClick={handleUploads}
              className=" hover:shadow-lg text-black-800 w-30 h-10 mt-3 text-center p-3 rounded-lg bg-green-600 items-center"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className=" flex justify-between gap-10 items-center text-center "
            >
              <img
                className="w-20 h-20 rounded-lg object-contain"
                src={url}
                alt="upload-image"
              />
              <button
                type="button"
                id="delete"
                onClick={() => deleteUploadImage(index)}
                className=" border hover:bg-red-700 bg-red-600 p-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))}
          <p className="text-red-700">{fileUploadError && fileUploadError}</p>
          <button
            disabled={loading || uploading}
            className="bg-slate-700 border p-3 w-7/12 self-center hover:bg-slate-600 rounded-lg"
          >
            {loading ? "updating..." : "Update Property"}
          </button>
          {/* <p className="text-red-700 self-center">{error && error}</p> */}
        </div>
      </form>
    </main>
  );
}
