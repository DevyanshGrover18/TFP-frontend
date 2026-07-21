import React from "react";
import {
  ShieldCheck,
  LayoutGrid,
  Scissors,
  Truck,
  HeadphonesIcon,
  Leaf } from
"lucide-react";

const features = [
{
  icon: ShieldCheck,
  title: "Premium Quality",
  description: "Sourced from trusted manufacturers"
},
{
  icon: LayoutGrid,
  title: "Wide Range",
  description: "Extensive product under one roof"
},
{
  icon: Scissors,
  title: "Custom Solutions",
  description: "OEM/ODM tailored to your needs"
},
{
  icon: Truck,
  title: "Reliable Supply",
  description: "Timely delivery, every time"
},
{
  icon: HeadphonesIcon,
  title: "Expert Support",
  description: "Dedicated team every step"
},
{
  icon: Leaf,
  title: "Ethical Practices",
  description: "Sustainable & responsible sourcing"
}];


const WhyChooseUs = () => {
  return (
    <section
      className="px-4 py-16 sm:px-6 lg:px-10"
      style={{ background: "#fdf5f3", fontFamily: "'DM Sans', sans-serif" }}>
      
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#d94f4f" }}>
            
            Why Choose TFP?
          </p>
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: "#1a1a1a", fontFamily: "'Georgia', serif", fontWeight: 700 }}>
            
            We Deliver More Than Materials
          </h2>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {features.map(({ icon: Icon, title, description }) =>
          <div key={title} className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Icon
                size={36}
                strokeWidth={1.2}
                style={{ color: "#d94f4f" }} />
              
              </div>
              <p
              className="mb-1.5 font-semibold"
              style={{ fontSize: "13px", color: "#1a1a1a" }}>
              
                {title}
              </p>
              <p
              className="leading-snug"
              style={{ fontSize: "12px", color: "#888" }}>
              
                {description}
              </p>
            </div>
          )}
        </div>

      </div>
    </section>);

};

export default WhyChooseUs;