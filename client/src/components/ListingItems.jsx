import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  let discount = 0;

  if (listing.offer) {
    discount = ((listing.discountPrice / listing.regularPrice) * 100).toFixed(
      0
    );
  }

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-[330px] m-2">
      <Link to={`/properties/${listing._id}`}>
        <img
          src={listing.imageUrls}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <div className="mt-2">
            {listing.offer && (
              <div className="flex items-center gap-2">
                <p className="text-red-600">{`-${discount}%`}</p>
                <div className="flex">
                  <p>₹{listing.regularPrice - listing.discountPrice}{" "}</p>
                  <p className="text-slate-600 text-sm"> {listing.type === "rent" && "/month"}</p>
                </div>
              </div>
            )}
            {listing.offer && (
              <p className=" line-through  text-slate-500">
                ₹{listing.regularPrice}
              </p>
            )}
            {!listing.offer && (
              <div className="flex ">
                <p>₹{listing.regularPrice}</p>
                <p className="text-sm text-slate-600">
                  {listing.type === "rent" ? "/rent" : "/month"}
                </p>
              </div>
            )}
          </div>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedRooms > 1
                ? `${listing.bedRooms} BedRooms `
                : `${listing.bedRooms} BedRoom `}
            </div>
            <div className="font-bold text-xs">
              {listing.bathRooms > 1
                ? `${listing.bathRooms} BathRooms `
                : `${listing.bathRooms} BathRoom `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
