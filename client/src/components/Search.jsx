import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItems from "../components/ListingItems";

export default function Search() {
  const [filter, setFilter] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  //console.log(filter);
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setFilter({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/properties/get?${searchQuery}`);
      const data = await res.json();
      if (!data) {
        console.log(data.messagge);
      }
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id == "all" ||
      e.target.id === "rent" ||
      e.target.id == "sale"
    ) {
      setFilter({
        ...filter,
        type: e.target.id,
      });
    }
    if (e.target.id === "searchTerm") {
      setFilter({
        ...filter,
        searchTerm: e.target.value,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFilter({
        ...filter,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? "true" : "false",
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setFilter({ ...filter, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", filter.searchTerm);
    urlParams.set("type", filter.type);
    urlParams.set("parking", filter.parking);
    urlParams.set("furnished", filter.furnished);
    urlParams.set("offer", filter.offer);
    urlParams.set("sort", filter.sort);
    urlParams.set("order", filter.order);

    const searchQuery = urlParams.toString();
    // console.log(searchQuery);
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/properties/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row pt-16">
      <div className=" p-7 border-b-2 md:border-r-2  h-full">
        <form onSubmit={handleSubmit} className=" flex flex-col gap-3">
          <div className=" flex gap-2 items-center">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              className="p-3 rounded-lg w-full border"
              id="searchTerm"
              placeholder="search..."
              type="text"
              value={filter.searchTerm}
              onChange={handleChange}
            ></input>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold"> Type:</label>
            <div className=" flex gap-1">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={filter.type === "all"}
              ></input>
              <span>Rent&Sale</span>
            </div>
            <div className=" flex gap-1">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={filter.type === "rent"}
              ></input>
              <span>Rent</span>
            </div>
            <div className=" flex gap-1">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={filter.type === "sale"}
              ></input>
              <span>Sale</span>
            </div>
            <div className=" flex gap-1">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={filter.offer}
              ></input>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold"> Amenities:</label>
            <div className=" flex gap-1">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={filter.parking}
              ></input>
              <span>Parking</span>
            </div>
            <div className=" flex gap-1">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={filter.furnished}
              ></input>
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-20">
            <label className=" font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-3"
              defaultValue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className=" bg-slate-700 hover:opacity-95 w-full rounded-lg p-2 text-white text-lg">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl p-7 font-semibold">Properties Results</h1>
        <div className="p-7 flex flex-wrap">
          {!loading && listings.length === 0 && (
            <p className="text-red-600 text-xl font-semibold">
              No Properties Found
            </p>
          )}
          {loading && (
            <p className="text-green-700 font-semibold text-sm self-center">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
