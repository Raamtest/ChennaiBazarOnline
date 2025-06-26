import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddProduct = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    subcategory: "",
    stock_quantity: "",
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error) setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Update product
        const { error } = await supabase.from("products").update({ ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) }).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Product Updated", description: "Product updated successfully." });
      } else {
        // Add new product
        const { error } = await supabase.from("products").insert([{ ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) }]);
        if (error) throw error;
        toast({ title: "Product Added", description: "Product added successfully." });
      }
      setForm({ name: "", description: "", price: "", image_url: "", category: "", subcategory: "", stock_quantity: "" });
      setEditingId(null);
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      subcategory: product.subcategory,
      stock_quantity: product.stock_quantity,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      toast({ title: "Product Deleted", description: "Product deleted successfully." });
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Product" : "Add Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
              <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
              <Input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
              <Input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} required />
              <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
              <Input name="subcategory" placeholder="Subcategory" value={form.subcategory} onChange={handleChange} required />
              <Input name="stock_quantity" type="number" placeholder="Stock Quantity" value={form.stock_quantity} onChange={handleChange} required />
              <Button type="submit" disabled={loading} className="w-full">{editingId ? "Update Product" : loading ? "Adding..." : "Add Product"}</Button>
              {editingId && <Button type="button" variant="outline" className="w-full" onClick={() => { setEditingId(null); setForm({ name: "", description: "", price: "", image_url: "", category: "", subcategory: "", stock_quantity: "" }); }}>Cancel Edit</Button>}
            </form>
          </CardContent>
        </Card>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Manage Products</h2>
          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <div className="space-y-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                    <div className="flex-1">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                      <div>Price: ₹{product.price}</div>
                      <div>Stock: {product.stock_quantity}</div>
                      <div>Category: {product.category}</div>
                      <div>Subcategory: {product.subcategory}</div>
                      <div><img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover mt-2" /></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" onClick={() => handleEdit(product)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDelete(product.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct; 