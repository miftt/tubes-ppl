import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link"; // <--- Import Link
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

import { BiodataForm } from "@/components/profile/BiodataForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Camera, ChevronLeft } from "lucide-react"; // <--- Tambah icon ChevronLeft

export const metadata = { title: "Profile Saya | DANews" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      
      {/* === TOMBOL KEMBALI === */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Pengaturan Akun</h1>
        <p className="text-muted-foreground">Kelola biodata dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === BAGIAN KIRI: KARTU IDENTITAS === */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 relative group">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={(user as any).avatar || ""} />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant="secondary">{(user as any).role || "Member"}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Aktif</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3"><Calendar className="w-4 h-4" /> <span>Bergabung Jan 2025</span></div>
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /> <span>Indonesia</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === BAGIAN KANAN: FORM EDIT (TABS) === */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="biodata" className="w-full">
            <TabsList className="w-full justify-start mb-6 border-b h-auto p-0 bg-transparent space-x-6">
              <TabsTrigger 
                value="biodata" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
              >
                Biodata Diri
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
              >
                Keamanan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="biodata">
              <BiodataForm user={{ name: user.name, email: user.email }} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}