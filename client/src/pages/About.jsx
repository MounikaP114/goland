import { useEffect, useState } from "react";

export default function About() {
  const [visibleElements, setVisibleElements] = useState({
    paragraph1: false,
    paragraph2: false,
    paragraph3: false,
    images: false,
  });

  useEffect(() => {
    const timeouts = [];

    timeouts.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, paragraph1: true })), 200));
    timeouts.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, paragraph2: true })), 500));
    timeouts.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, paragraph3: true })), 800));
    timeouts.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, images: true })), 1200));

    // Clean up timeouts on unmount
    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  const fadeInStyle = (isVisible) => ({
    opacity: isVisible ? 1 : 0,
    transition: "opacity 1s ease-in",
  });

  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <div className="relative">
        <img
          src="https://images.pexels.com/photos/3745234/pexels-photo-3745234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Real estate"
          className="w-full h-64 object-cover rounded-lg shadow-md"
          style={fadeInStyle(visibleElements.paragraph1)}
        />
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-white">
          About Go Land
        </h1>
      </div>
      <div className="mt-10 text-center">
        <p
          className="mb-4 text-lg text-slate-700 leading-relaxed"
          style={fadeInStyle(visibleElements.paragraph1)}
        >
          Go Land is a leading real estate agency that specializes in helping
          clients buy, sell, and rent properties in the most desirable
          neighborhoods. Our team of experienced agents is dedicated to providing
          exceptional service and making the buying and selling process as smooth
          as possible.
        </p>
        <p
          className="mb-4 text-lg text-slate-700 leading-relaxed"
          style={fadeInStyle(visibleElements.paragraph2)}
        >
          Our mission is to help our clients achieve their real estate goals by
          providing expert advice, personalized service, and a deep understanding
          of the local market. Whether you are looking to buy, sell, or rent a
          property, we are here to help you every step of the way.
        </p>
        <p
          className="mb-4 text-lg text-slate-700 leading-relaxed"
          style={fadeInStyle(visibleElements.paragraph3)}
        >
          Our team of agents has a wealth of experience and knowledge in the real
          estate industry, and we are committed to providing the highest level of
          service to our clients. We believe that buying or selling a property
          should be an exciting and rewarding experience, and we are dedicated to
          making that a reality for each and every one of our clients.
        </p>
        <div
          className="flex justify-center mt-8 space-x-4"
          style={fadeInStyle(visibleElements.images)}
        >
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
            Contact Us
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
            View Listings
          </button>
        </div>
      </div>
      <div className="mt-10 text-center" style={fadeInStyle(visibleElements.images)}>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportmale-512.png"
             
              alt="Agent 1"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-slate-800">Vinay</h3>
            <p className="text-slate-700">Senior Agent</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportmale-512.png"
              alt="Agent 2"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-slate-800">Harsha</h3>
            <p className="text-slate-700">Senior Agent</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportmale-512.png"
              alt="Agent 3"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-slate-800">Nithish</h3>
            <p className="text-slate-700">Senior Agent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
