
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text text-center">
              About Chennai Bazaar
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Chennai Bazaar Online is your trusted local marketplace connecting Chennai's best vendors with customers. 
                We're passionate about supporting local businesses and bringing the vibrant spirit of Chennai's markets to your doorstep.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                To digitize Chennai's traditional bazaars and empower local vendors with modern e-commerce tools while 
                providing customers with authentic, quality products from trusted local sources.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>100% authentic products from verified Chennai vendors</li>
                <li>Same-day delivery across all Chennai zones</li>
                <li>Supporting local economy and traditional businesses</li>
                <li>Quality assurance on every product</li>
                <li>Dedicated customer support in Tamil and English</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground">
                Founded in 2024, Chennai Bazaar was born from a simple idea: bring the bustling energy 
                and authentic products of Chennai's traditional markets to the digital age. We started 
                with vendors from T. Nagar and have grown to include merchants from across Chennai.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
