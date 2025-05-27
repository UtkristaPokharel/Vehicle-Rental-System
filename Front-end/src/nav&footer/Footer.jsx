import React from 'react';
import './Footer.css';
import facebook from "../images/facebook.png"
import linkedin from "../images/linkedin.png"
import instagram from "../images/instagram.png"

export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer-container">

				<div className="footer-section">
					<h3>About Us</h3>
					<p>
Easy Wheels is our 7th semester project focused on vehicle rentals.
It helps users easily book cars, bikes, or scooters online.
Designed to be fast, simple, and user-friendly.
					</p>
				</div>

				{/* Contact Info */}
				<div className="footer-section">
					<h3>Contact Info</h3>
					<p>Butwal, Rupandehi</p>
					<p>9806418493, 9804439499</p>
					<p>info@easywheels.com.np</p>
				</div>

				{/* Quick Links */}
				<div className="footer-section">
					<h3>Quick Links</h3>
					<ul>
						<li><a href="/about">About</a></li>
						<li><a href="/blog">Vehicles</a></li>
						<li><a href="/contact">Contact</a></li>
						<li><a href="/register">Become a host</a></li>
					</ul>
				</div>

				{/* Social */}
				<div className="footer-section">
					<h3>Social Network</h3>
					<div className="social-icons">
						<a href="#"><img src={facebook} alt="Facebook" />Facebook</a>
						<a href="#"><img src={linkedin} alt="LinkedIn" />LinkedIn</a>
						<a href="#"><img src={instagram} alt="Instagram" />Instagram</a>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				<p>Copyright © 2025 EasyWheels</p>
				<a href="/privacy">Privacy Policy</a>
			</div>
		</footer>
	);
};
