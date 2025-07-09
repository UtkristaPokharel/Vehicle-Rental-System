import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const ContactUs = () => {
	return (
		<>
			{/* <Navbar /> */}
			{/* <div className="bg-white min-h-screen"> */}
			<div className="flex flex-col rounded-t-lg shadow-xl md:flex-row bg-blue-700 text-white py-10 px-4 md:px-10 mt-20 text-center md:text-left relative max-w-screen-2xl mx-auto" id="contactus-section"
			>
				<div className="flex flex-col ml-10 items-center md:items-start w-full md:w-1/2">
					<h1 className="text-3xl md:text-4xl font-bold">Contact us</h1>
					<p className="text-base md:text-lg mt-2">Ask your queries with us for free.</p>
				</div>

			{/* <div className="absolute top-4 right-10 flex items-center space-x-2">
						<img
							src="utkrista.jpeg"
							alt="Mr. Utkrista"
							className="w-10 h-10 rounded-full"
						/>
						<div className="text-sm">
							<div>Need Help? </div>
							<div className="flex items-center space-x-2">
								<FaWhatsapp className="text-[#0eeb4d]" />
								<div className="font-bold">+977 9804439499</div>
							</div>
						</div>
					</div> */}
		</div >

			<div className="flex flex-col md:flex-row justify-center px-4 md:px-20 py-10 space-y-10 md:space-y-0 md:space-x-10">
				<div className="bg-indigo-50 p-6 rounded-lg shadow-md w-full md:w-1/3">
					<h2 className="text-xl font-semibold text-indigo-900 mb-4">Contact Details</h2>
					<p className="mb-4 text-sm text-indigo-900">
						We're here for you. We'll get to you as soon as possible.
					</p>
					<div className="space-y-4 text-gray-800 text-sm">
						<div className="flex items-start">
							<FaMapMarkerAlt className="text-[#fe1900] mt-1" />
							<span className="ml-3">Butwal, Rupandehi, Nepal</span>
						</div>
						<div className="flex items-start">
							<FaPhoneAlt className="text-[#2bc055] mt-1" />
							<span className="ml-3">+977 71537999</span>
						</div>
						<div className="flex items-start">
							<FaWhatsapp className="text-[#2bc055] mt-1" />
							<span className="ml-3">
								+977 9806418493
							</span>
						</div>
						<div className="flex items-start">
							<FaEnvelope className="text-[#d11919] mt-1" />
							<span className="ml-3">
								info@easywheels.com.np<br />
								pokharelutkrista@gmail.com
								bhuwan626282@gmail.com
							</span>
						</div>
					</div>
				</div>

				<div className="bg-[#f6f6f6] w-full md:w-2/3 p-6 border-0 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-2">
						Get in Touch with EasyWheels!
					</h2>
					<p className="text-sm text-gray-600 mb-4">
						<strong>Note:</strong> <span className="text-red-500">*</span> symbol represents required
					</p>

					<form className="space-y-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm">Name <span className="text-red-500">*</span></label>
								<input type="text" placeholder="Full Name" className="w-full px-4 py-2 mt-1 border-0 rounded bg-white" />
							</div>
							<div>
								<label className="text-sm">Email <span className="text-red-500">*</span></label>
								<input type="email" placeholder="Your Email" className="w-full px-4 py-2 mt-1 border-0 rounded bg-white" />
							</div>
							<div>
								<label className="text-sm">Your Address <span className="text-red-500">*</span></label>
								<input type="text" placeholder="Address" className="w-full px-4 py-2 mt-1 border-0 rounded bg-white" />
							</div>
							<div>
								<label className="text-sm">Phone</label>
								<div className="flex items-center">
									<span className="px-3 py-2 border-0 bg-white text-gray-600 rounded-l">🇳🇵</span>
									<input type="tel" placeholder="Your Phone" className="w-full px-4 py-2 border-0 rounded-r bg-white" />
								</div>
							</div>
						</div>
						<div>
							<label className="text-sm">Message <span className="text-red-500">*</span></label>
							<textarea rows="4" className="w-full px-4 py-2 mt-1 border-0 rounded bg-white" placeholder="Your Message" />
						</div>
						<button type="submit" className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
							Submit
						</button>
					</form>
				</div>
			</div>
	{/* </div> */ }
	{/* <Footer /> */ }
		</>
	);
};

export default ContactUs;
