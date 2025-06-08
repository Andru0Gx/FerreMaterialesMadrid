import HeroSection from "@/components/home/hero-section"
import CategoriesSection from "@/components/home/categories-section"
import FeaturedProducts from "@/components/home/featured-products"
import DeliverySection from "@/components/home/delivery-section"
import LocationSection from "@/components/home/location-section"
import WhyChooseUs from "@/components/home/why-choose-us"

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategoriesSection />
      {/* <FeaturedProducts /> */}
      <DeliverySection />
      <LocationSection />
      <WhyChooseUs />
    </div>
  )
}
