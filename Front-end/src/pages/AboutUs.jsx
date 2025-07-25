const AboutUs = () => {
	return (
		<div className="min-h-screen bg-black text-white font-sans">

				<section className="relative bg-gradient-to-br from-red-700 via-black to-red-800 py-24 overflow-hidden">
					<div className="absolute inset-0 bg-[url('butwal.jpeg')] opacity-20 bg-cover bg-center"></div>
					<div className="container mx-auto px-4 text-center relative z-10">
						<h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in-down">
							Easy<span className="text-red-500">Wheels</span>
						</h1>
						<p className="text-lg md:text-2xl max-w-3xl mx-auto opacity-90 animate-fade-in-up">
							Your vehicle rental service in Butwal, Nepal, crafting unforgettable journeys with style, comfort, and reliability.
						</p>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
				</section>


				<section className="py-20 bg-black">
					<div className="container mx-auto px-4">
						<div className="flex flex-col md:flex-row items-center gap-12">
							<div className="md:w-1/2 order-2 md:order-1">
								<h2 className="text-4xl font-bold text-red-500 mb-6 animate-slide-in-left">Our Mission</h2>
								<p className="text-gray-300 text-lg leading-relaxed">
									At EasyWheels, we’re driven to transform travel in Nepal. Based in the vibrant city of Butwal, we provide top-tier vehicle rentals that blend affordability, safety, and convenience. Our mission is to empower every traveler—whether a local or a visitor—to explore Nepal’s breathtaking landscapes and rich culture with ease and excitement.
								</p>
							</div>
							<div className="md:w-1/2 order-1 md:order-2">
								<img
									src="fortuner.jpeg"
									alt="Vehicle in scenic Nepal"
									className="rounded-xl shadow-2xl object-cover w-full h-64 md:h-96 transform hover:scale-105 transition duration-500"
								/>
							</div>
						</div>
					</div>
				</section>

				<section className="py-20 bg-indigo-50">
					<div className="container mx-auto px-4">
						<h2 className="text-4xl font-bold text-center text-indigo-900 mb-12">Why EasyWheels?</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-indigo-900">
							<div className="text-center p-8 bg-white border-0 rounded-xl hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
								<svg className="w-12 h-12 mx-auto mb-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10h6m-6 0H3m12 0h6m-6-10h6M9 7H3m6 0v10"></path>
								</svg>
								<h3 className="text-xl font-bold mb-3">Diverse Fleet</h3>
								<p className="text-indigo-950">From sleek sedans to rugged SUVs, choose the perfect vehicle for your adventure.</p>
							</div>
							<div className="text-center p-8 bg-white border-0 rounded-xl hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
								<svg className="w-12 h-12 mx-auto mb-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
								</svg>
								<h3 className="text-xl font-bold mb-3">Budget-Friendly</h3>
								<p className="text-indigo-950">Competitive pricing with no surprises, ensuring value for every ride.</p>
							</div>
							<div className="text-center p-8 bg-white border-0 rounded-xl hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
								<svg className="w-12 h-12 mx-auto mb-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
								</svg>
								<h3 className="text-xl font-bold mb-3">Local Expertise</h3>
								<p className="text-indigo-950">Our team’s deep knowledge of Nepal ensures you travel like a local.</p>
							</div>
						</div>
					</div>
				</section>

				<section className="py-20 bg-black">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-4xl font-bold text-red-500 mb-6 animate-slide-in-right">Our Story</h2>
						<p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
							EasyWheels was born in the heart of Butwal, Nepal, fueled by a passion for making travel effortless and exciting. Inspired by Nepal’s stunning landscapes and warm hospitality, we set out to create a vehicle rental service that combines modern convenience with local charm. Today, EasyWheels is proud to serve adventurers and locals alike, helping them discover Nepal’s beauty with every ride.
						</p>
					</div>
				</section>

				<section className="py-20 bg-gradient-to-r from-red-600 to-red-900">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-4xl font-bold mb-6 animate-bounce">Ready to Ride with EasyWheels?</h2>
						<p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
							Book your vehicle now and start your journey through the vibrant streets and scenic routes of Nepal!
						</p>
						<a
							href="/book-now"
							className="inline-block bg-black text- font-semibold py-4 px-8 rounded-full text-lg hover:bg-indigo-800 hover:shadow-xl transition duration-300 transform hover:scale-110"
						>
							Book Your Ride
						</a>
					</div>
				</section>

				{/* Custom Tailwind Animations */}
				<style jsx>{`
					@keyframes fadeInDown {
						from {
						opacity: 0;
						transform: translateY(-20px);
						}
						to {
						opacity: 1;
						transform: translateY(0);
						}
					}
					@keyframes fadeInUp {
						from {
						opacity: 0;
						transform: translateY(20px);
						}
						to {
						opacity: 1;
						transform: translateY(0);
						}
					}
					@keyframes slideInLeft {
						from {
						opacity: 0;
						transform: translateX(-20px);
						}
						to {
						opacity: 1;
						transform: translateX(0);
						}
					}
					@keyframes slideInRight {
						from {
						opacity: 0;
						transform: translateX(20px);
						}
						to {
						opacity: 1;
						transform: translateX(0);
						}
					}
					.animate-fade-in-down {
						animation: fadeInDown 1s ease-out;
					}
					.animate-fade-in-up {
						animation: fadeInUp 1s ease-out;
					}
					.animate-slide-in-left {
						animation: slideInLeft 1s ease-out;
					}
					.animate-slide-in-right {
						animation: slideInRight 1s ease-out;
					}
      			`}</style>
			</div>
	);
};

export default AboutUs;