import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Category { id: string; name: string }
interface Photo { id: string; public_url: string; caption: string | null; category_id: string | null; created_at: string }

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    void loadCategories();
    void loadPhotos();
  }, [session]);

  const loadCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) {
      toast.error("Failed to load categories");
      return;
    }
    setCategories(data ?? []);
  };

  const loadPhotos = async () => {
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from("photos")
      .select("id, public_url, caption, category_id, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) toast.error("Failed to load photos");
    setPhotos(data ?? []);
    setLoadingPhotos(false);
  };

  const handleSendMagicLink = async () => {
    if (!email) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setSending(false);
    if (error) toast.error(error.message);
    else toast.success("Check your email for the login link");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCategories([]);
    setPhotos([]);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    const { error } = await supabase.from("categories").insert({ name: newCategory.trim() });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewCategory("");
    toast.success("Category created");
    void loadCategories();
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `gallery/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      const public_url = pub?.publicUrl as string;
      const { error: insErr } = await supabase.from("photos").insert({
        storage_path: path,
        public_url,
        caption: caption || null,
        category_id: categoryId || null,
      });
      if (insErr) throw insErr;
      setFile(null);
      setCaption("");
      setCategoryId(undefined);
      toast.success("Photo uploaded");
      void loadPhotos();
    } catch (e: unknown) {
      const message = typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : 'Upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);

  if (!session) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button onClick={handleSendMagicLink} disabled={!email || sending} className="w-full">
              {sending ? "Sending..." : "Send Magic Link"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Admin Panel</h1>
        <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Image</Label>
              <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" />
              <Button onClick={handleCreateCategory} disabled={!newCategory.trim()}>Add</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingPhotos ? (
                  <TableRow>
                    <TableCell colSpan={4}>Loading...</TableCell>
                  </TableRow>
                ) : photos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No photos yet</TableCell>
                  </TableRow>
                ) : (
                  photos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <img src={p.public_url} alt={p.caption ?? "photo"} className="h-16 w-16 object-cover rounded" />
                      </TableCell>
                      <TableCell>{p.caption}</TableCell>
                      <TableCell>{p.category_id ? categoryMap.get(p.category_id) : ""}</TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
