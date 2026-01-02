'use client';
import Link from "next/link";
import Image from "next/image";
import { FaUserMd, FaFileMedical, FaBrain, FaPhoneAlt } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <main className="min-h-[calc(100vh-120px)] bg-[#f5f9ff]">
        {/* Section welcome */}
        <section className="relative text-black text-center py-20 px-8 overflow-hidden">
      <Image
        src="/dooc.avif"
        alt="Background image"
        fill
        className="object-cover object-center"
        quality={75}
        priority // Optional: Load image immediately for hero section
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-4 text-white">WELCOME TO HEALTH AI+</h1>
        <p className="text-2xl max-w-4xl mx-auto mb-8 text-white">
          Your trusted platform for advanced health consultations and personalized medical services powered by AI.
        </p>
        
      </div>
    </section>
        
        {/* Section services */}
        <section className="flex flex-wrap justify-center gap-8 py-16 px-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div 
              key={service.title}
              className="bg-white rounded-xl shadow-lg p-10 w-full max-w-sm text-center transition-transform hover:-translate-y-2.5 hover:shadow-xl"
            >
              <h2 className="text-[#4b6cb7] text-2xl mb-4">{service.title}</h2>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <Link 
                href={service.link} 
                className="inline-block mt-4 bg-[#4b6cb7] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#3a5aa0] transition-colors"
              >
                {service.buttonText}
              </Link>
            </div>
          ))}
        </section>
        <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                  <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Our Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1: Patient Portal */}
                    <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
                      <FaFileMedical className="text-4xl text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Patient Portal</h3>
                      <p className="text-gray-600">
                        Securely access and download your scan results, view health history, and manage your medical data.
                      </p>
                    </div>
                    {/* Feature 2: AI Classification */}
                    <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
                      <FaBrain className="text-4xl text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">AI Classification</h3>
                      <p className="text-gray-600">
                        Upload scans for instant AI-driven classification with detailed reports and confidence scores.
                      </p>
                    </div>
                    {/* Feature 3: Physician Consultation */}
                    <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
                      <FaUserMd className="text-4xl text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Physician Consultation</h3>
                      <p className="text-gray-600">
                        Connect with nearby doctors, schedule appointments, or communicate via messaging or video.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
      </main>

      <Footer />
    </>
  );
}

const services = [
  {
    title: "Let's Book Your Appointment",
    description: "Easily book your appointment for a medical scan in our laboratory.",
    buttonText: "Book Appointment",
    link: "/patient/appointment",
  },
  {
    title: "Let's Consult",
    description: "Consultation avec des médecins qualifiés pour des conseils de santé personnalisés.",
    buttonText: "Prendre RDV",
    link: "/patient/appointment",
  },
];
