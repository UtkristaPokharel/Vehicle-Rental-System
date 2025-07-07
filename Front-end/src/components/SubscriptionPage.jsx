import React from 'react';

const SubscriptionForm = () => {
	return (
		<div className="bg-indigo-50 p-6 flex flex-col md:flex-col items-center justify-between w-full max-w-7xl mx-auto mt-10 mb-10 text-indigo-900  ">
			<div className='flex gap-10'>
				<div className="mb-4 md:mb-0">
					<h2 className="text-2xl font-bold">Unique offers with the best discounts</h2>
					<p className="mt-2">Join now and don’t let any promotions slip through your fingers.</p>
				</div>
				<div className="flex flex-col">
					<div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4'>
						<input
							type="text"
							placeholder="Enter your name..."
							className="p-2 border bg-[#fff] rounded w-full md:w-48"
						/>
						<input
							type="email"
							placeholder="Enter your e-mail address"
							className="p-2 border bg-[#fff] rounded w-full md:w-64"
						/>
						<button className="bg-red-600 text-white px-4 py-2 rounded w-full md:w-auto">
							Subscribe
						</button>
					</div>
					<div className="mt-4 text-center text-xs md:text-left">
						<label className="flex items-center justify-center md:justify-start">
							<input type="checkbox" className="mr-2" defaultChecked />
							Yes, I give my consent to receive information and personalized offers from EasyWheels.
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionForm;