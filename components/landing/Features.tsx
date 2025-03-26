import { Clock, Shield, MapPin } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-24 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-primary-content" />
              </div>
              <h3 className="card-title">24/7 Service</h3>
              <p>Round-the-clock availability for all your locksmith needs.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary-content" />
              </div>
              <h3 className="card-title">Vetted Professionals</h3>
              <p>All our locksmiths are thoroughly checked and certified.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary-content" />
              </div>
              <h3 className="card-title">Local Experts</h3>
              <p>Find skilled locksmiths in your area quickly and easily.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
