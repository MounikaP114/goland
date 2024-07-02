import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signInFailure,
  signInSuccess,
  signInStart,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/userSlice";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateUserData, setUpdateUserData] = useState(false);
  const [listProperties, setListProperties] = useState([]);
  const [listPropertiesError, setListPropertiesError] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [deletePropertyError, setDeletePropertyError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (file) {
      handleUploadFile(file);
    }
  }, [file]);

  const handleUploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadProgress(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateUserData(true);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserStart(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      navigate("/signin");
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handlePropertyList = async () => {
    try {
      setListPropertiesError(false);
      setLoadingList(true);
      const res = await fetch(`/api/user/properties-list/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setFileUploadError(data.message);
        setLoadingList(false);
        return;
      }
      setListProperties(data);
      setLoadingList(false);
    } catch (error) {
      setFileUploadError(error.message);
      setLoadingList(false);
    }
  };

  const deleteProperty = async (propertyid) => {
    try {
      const res = await fetch(`/api/properties/delete/${propertyid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setDeletePropertyError(data.message);
        return;
      }
      setListProperties((prev) =>
        prev.filter((item) => propertyid !== item._id)
      );
    } catch (error) {
      setDeletePropertyError(error.message);
    }
  };

  return (
    <div className="pt-12 bg-purple-200">
      <div
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/7354473/pexels-photo-7354473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1 ")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
        className="bg-fixed flex flex-col items-center py-12"
      >
        <h1 className="text-4xl font-semibold text-white mb-6">Profile</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="flex flex-col items-center gap-4">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
            ></input>
            <img
              src={formData.avatar || currentUser.avatar}
              onClick={() => fileRef.current.click()}
              alt="profile"
              className="rounded-full mt-2 cursor-pointer object-cover h-24 w-24"
            ></img>
            <p className="text-sm">
              {fileUploadError ? (
                <span className="text-red-700">
                  Error While Uploading Image
                </span>
              ) : fileUploadProgress > 0 && fileUploadProgress < 100 ? (
                <span className="text-green-700">
                  {`Uploading ${fileUploadProgress}%`}
                </span>
              ) : fileUploadProgress === 100 ? (
                <span className="text-green-700">
                  Image uploaded successfully!
                </span>
              ) : (
                ""
              )}
            </p>
          </div>
          <input
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
            onChange={handleChange}
            className="border bg-gray-100 p-3 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
            className="border bg-gray-100 p-3 rounded-lg"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            className="bg-gray-100 p-3 rounded-lg border"
          />
          <button
            disabled={loading}
            className="bg-purple-600 text-white p-3 rounded-lg uppercase hover:bg-purple-700"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          {showMessage && (
            <p className="text-green-700 self-center font-semibold">
              Updated Successfully
            </p>
          )}
          <Link
            to={"/create"}
            className="bg-green-500 text-white p-3 rounded-lg uppercase hover:bg-green-600 text-center"
          >
            Add Property
          </Link>
        </form>
        <button
          type="button"
          disabled={loading}
          onClick={handlePropertyList}
          className="mt-6 bg-blue-500 text-white p-3 rounded-lg uppercase hover:bg-blue-600 w-full max-w-md"
        >
          {loadingList ? "Loading..." : "Show List of Properties"}
        </button>
        <div className="mt-6 flex gap-10">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:underline"
          >
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className="text-blue-500 hover:underline"
          >
            Sign Out
          </button>
        </div>
        {error && <p className="text-red-700 text-sm mt-4">{error}</p>}
        {listPropertiesError && (
          <p className="text-red-700 text-sm mt-4">
            Please check and try again
          </p>
        )}
        {deletePropertyError && (
          <p className="text-red-700 text-sm mt-4">{deletePropertyError}</p>
        )}
        <div className="mt-6 w-full max-w-md">
          {listProperties.map((list) => (
            <div
              key={list._id}
              className="flex gap-4 rounded-lg border p-4 mb-4 bg-white shadow-lg"
            >
              <img
                src={list.imageUrls[0]}
                alt="property"
                className="h-20 w-20 object-cover rounded-lg"
              />
              <Link to={`/properties/${list._id}`} className="flex-grow">
                <p className="text-lg text-gray-700 hover:underline">
                  {list.name}
                </p>
              </Link>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => deleteProperty(list._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
                <Link to={`/update-property/${list._id}`}>
                  <button className="text-green-500 hover:underline">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
