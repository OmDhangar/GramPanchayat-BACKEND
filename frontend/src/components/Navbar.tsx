import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X ,User2Icon} from "lucide-react";
import { useAuthContext } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const navItems = [
	{
		label: "HOME"
	},
	{
		label: "THE VILLAGE",
		links: [
			"About Vathode"
		],
	},
	{
		label: "GRAM PANCHAYAT",
		links: ["Members", "Meetings", "Schemes"],
	},
	{
		label: "CITIZEN FACILITIES",
		links: ["Apply for Certificates"],
	},
	{
		label: "PUBLIC INFORMATION",
		links: ["Notices"],
	},
	
	{
		label: "HELP",
		links: [ "Contact"],
	},
];

export default function Navbar() {
	const [hovered, setHovered] = useState<number | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);
	const { isAuthenticated, setIsAuthenticated, setUser } = useAuthContext();
	const navigate = useNavigate();

	// Helper for mobile dropdown toggle
	const handleMobileDropdown = (idx: number) => {
		setMobileDropdown(mobileDropdown === idx ? null : idx);
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("user");
		setIsAuthenticated(false);
		setUser(null);
		navigate("/login");
	};

	return (
		<div className="relative z-50 w-full shadow-sm">
			{/* Header */}
			<div className="bg-white py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between px-4">
					
					<img
						src="/images/mhlogo.png"
						alt="Government Logo"
						className="h-16 w-auto"
					/>

					{/* Center Content */}
					<div className="flex flex-col items-center flex-1">
						<img
							src="/images/panchyatlogo.png"
							alt="Panchayat Logo"
							className="h-12 mx-auto mb-1"
						/>
						<h1 className="text-5xl text-yellow-800 font-semibold tracking-wide tiro-header">
  ग्रामपंचायत वाठोडे ता. शिरपुर जि. धुळे 
</h1>

						<p className="text-sm text-gray-500 italic">
							let's connect digitally
						</p>
					</div>

					<div className="flex items-center gap-3">
					  {/* Right Logo */}
					  <img
					    src="/images/azadi-ka-amrit-mahotsav-.jpg"
					    alt="Other Logo"
					    className="h-16 w-auto"
					  />
					  {/* Login/Logout Button */}
					  {!isAuthenticated ? (
					    <button
					      onClick={() => navigate("/login")}
					      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-red-700 transition"
					    >
					      <User2Icon/>
					    </button>
					  ) : (
					    <span className="ml-4">
					      <button onClick={handleLogout}>
					        <LogoutButton />
					      </button>
					    </span>
					  )}
					</div>
				</div>
			</div>

			{/* Hamburger for mobile */}
			<div className="md:hidden flex justify-end px-4 py-2 bg-white border-t border-gray-200">
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label="Open menu"
				>
					{mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{/* Marquee Welcome Line */}
			<div className="w-full flex justify-center bg-yellow-100 py-1 border-b border-yellow-300">
				<div className="overflow-hidden w-full max-w-3xl">
					<div className="animate-marquee whitespace-nowrap text-blue-900 font-bold text-base md:text-lg">
						🙏🏻 Welcome to Vathoda Gram Panchayat! | ग्रामपंचायत वाठोडे मध्ये स्वागत आहे!
					</div>
				</div>
			</div>
			
			{/* Navbar for desktop */}
			<nav className="hidden md:block bg-white/90 backdrop-blur-sm border-t border-gray-200">
				<ul className="flex justify-center space-x-6 px-4 py-2 text-sm font-medium text-gray-900 uppercase tracking-wide relative">
					{navItems.map((item, idx) => (
						<li
							key={idx}
							className="relative"
							onMouseEnter={() => setHovered(idx)}
							onMouseLeave={() => setHovered(null)}
						>
							{item.label === "HOME" ? (
								<Link
									to="/"
									className="flex items-center space-x-1 cursor-pointer hover:text-yellow-600 transition px-2 py-1"
								>
									{item.label}
								</Link>
							) : (
								<>
									<div className="flex items-center space-x-1 cursor-pointer hover:text-yellow-600 transition">
										{item.label}
										<ChevronDown size={14} />
									</div>
									{/* Dropdown */}
									{hovered === idx && Array.isArray(item.links) && (
										<div className="absolute left-0 top-full w-48 bg-gray-500 bg-opacity-90 text-white rounded shadow-lg z-20">
											{item.links.map((link, linkIdx) => (
												<Link
													to={`/${link.toLowerCase().replace(/ /g, "-")}`}
													key={linkIdx}
													className="block px-4 py-2 hover:bg-gray-700 transition bg-transparent text-sm"
												>
													{link}
												</Link>
											))}
										</div>
									)}
								</>
							)}
						</li>
					))}
				</ul>
			</nav>

{/* Mobile Menu */}
{mobileMenuOpen && (
	<div className="md:hidden fixed inset-0 z-50">
		{/* Overlay */}
		<div
			className="absolute inset-0 bg-black bg-opacity-40"
			onClick={() => setMobileMenuOpen(false)}
			tabIndex={-1}
			aria-hidden="true"
		/>
		{/* Menu */}
		<div className="relative bg-white border-t border-gray-200 h-full shadow-lg p-4 z-50">
			<div className="flex flex-col space-y-2 text-yellow-900 font-medium uppercase tracking-wide">
				{navItems.map((item, idx) => (
					<div key={idx} className="relative">
						{item.label === "HOME" ? (
							<Link
								to="/"
								className="block px-4 py-2 text-sm font-medium text-yellow-900 uppercase tracking-wide hover:bg-yellow-100 rounded transition"
								onClick={() => setMobileMenuOpen(false)}
							>
								{item.label}
							</Link>
						) : (
							<>
								<button
									className="flex items-center justify-between w-full text-left px-4 py-2 text-sm font-medium text-yellow-900 uppercase tracking-wide hover:bg-yellow-100 transition focus:outline-none"
									onClick={() => handleMobileDropdown(idx)}
								>
									<span>{item.label}</span>
									<ChevronDown
										size={18}
										className={`transition-transform ${mobileDropdown === idx ? "rotate-180" : ""}`}
									/>
								</button>
								{/* Dropdown */}
								{mobileDropdown === idx && Array.isArray(item.links) && (
									<div className="pl-4">
										{item.links.map((link, linkIdx) => (
											<Link
												to={`/${link.toLowerCase().replace(/ /g, "-")}`}
												key={linkIdx}
												className="block px-2 py-2 text-sm hover:bg-yellow-100 rounded transition"
												onClick={() => setMobileMenuOpen(false)}
											>
												{link}
											</Link>
										))}
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	</div>
)}
		</div>
	);
}
