import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { ShoppingCart, Twitter, Instagram } from 'lucide-react';
import CheckoutForm from './components/CheckoutForm';
import HeroSlider from './components/HeroSlider';
import './App.css';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key');

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const products: Product[] = [
  { id: 1, name: 'Tidal Account', price: 9.99, description: 'Premium Tidal streaming account' },
  { id: 2, name: 'Twitter Script', price: 19.99, description: 'Automate your Twitter activities' },
  { id: 3, name: 'Instagram Script', price: 24.99, description: 'Boost your Instagram engagement' },
];

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="hidden font-bold sm:inline-block">Whizyre</span>
              </a>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a className="transition-colors hover:text-foreground/80 text-foreground" href="#products">Products</a>
                <a className="transition-colors hover:text-foreground/80 text-foreground" href="#about">About</a>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <ModeToggle />
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowCheckout(true)}>
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {showCheckout ? (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Elements stripe={stripePromise}>
                  <CheckoutForm cart={cart} totalAmount={totalAmount} onCancel={() => setShowCheckout(false)} />
                </Elements>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HeroSlider />

                <motion.section
                  id="products"
                  className="py-16"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-8">Our Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <Card className="h-full flex flex-col">
                          <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>{product.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                          </CardContent>
                          <CardFooter>
                            <Button onClick={() => addToCart(product)} className="w-full">Add to Cart</Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  id="about"
                  className="bg-muted py-16 -mx-4 px-4 rounded-lg"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">About Whizyre</h2>
                    <Card>
                      <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg">
                          Whizyre is your one-stop shop for digital products and scripts to enhance your
                          online presence and automate your social media activities. We're committed to
                          providing cutting-edge tools that help you stay ahead in the digital world.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t">
          <div className="container mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">© 2023 Whizyre. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;