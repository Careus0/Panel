
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Settings2, FileText, AlertTriangle, Bot, DollarSign, BarChartHorizontal, UserCog, UserX, BadgeX, Edit, MoreVertical, ShieldAlert, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Data tiruan - dalam aplikasi nyata, ini akan berasal dari API
const mockAdminUsers = [
  { id: "admin1", name: "Super Admin", email: "super@sentinel.com", role: "Superadmin", status: "Aktif" },
  { id: "admin2", name: "Pimpinan Dukungan", email: "supportlead@sentinel.com", role: "Dukungan", status: "Aktif" },
  { id: "admin3", name: "Dev Ops", email: "devops@sentinel.com", role: "Pengembang", status: "Tidak Aktif" },
];

const mockEndUsers = [
  { id: "user123", email: "alpha@example.com", plan: "Pro Bulanan", accountStatus: "Aktif", botSlots: 5, userbotStatus: "3 Aktif / 2 Tidak Aktif" },
  { id: "user456", email: "bravo@example.com", plan: "Pemula Tahunan", accountStatus: "Aktif", botSlots: 1, userbotStatus: "1 Aktif / 0 Tidak Aktif" },
  { id: "user789", email: "charlie@example.com", plan: "Enterprise Bulanan", accountStatus: "Ditangguhkan", botSlots: 20, userbotStatus: "0 Aktif / 0 Tidak Aktif" },
  { id: "user000", email: "delta@example.com", plan: "Pro Bulanan", accountStatus: "Aktif", botSlots: 5, userbotStatus: "5 Aktif / 0 Tidak Aktif"},
];

export default function AdminPage() {
  const { toast } = useToast();

  const handleSimulatedAction = (action: string, targetName?: string) => {
    toast({
      title: "Tindakan Disimulasikan",
      description: `${action}${targetName ? ` untuk ${targetName}` : ''} telah disimulasikan.`,
    });
    console.log(`Disimulasikan: ${action}${targetName ? ` untuk ${targetName}` : ''}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang di Panel Admin Sentinel Ubot. Kelola pengguna, konfigurasikan pengaturan situs, dan lihat log sistem.
        </p>
      </div>

      <Card className="border-yellow-500 border-2 bg-yellow-50 dark:bg-yellow-900/20">
        <CardHeader className="flex flex-row items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <CardTitle className="text-yellow-700 dark:text-yellow-300">Akses Terbatas</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-yellow-600 dark:text-yellow-400">
                Area ini hanya untuk administrator dan pengembang yang berwenang.
                Akses atau penggunaan yang tidak sah dapat dikenakan pemantauan dan tindakan hukum.
            </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Metrik & Statistik Utama</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pengguna Berdasarkan Paket</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.250</div>
              <p className="text-xs text-muted-foreground">Pemula: 700, Pro: 450, Enterprise: 100</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Userbot</CardTitle>
              <Bot className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.800 Total</div>
              <p className="text-xs text-muted-foreground">Aktif: 1.500, Tidak Aktif: 300</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendapatan (Simulasi)</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 123.456.789</div>
              <p className="text-xs text-muted-foreground">Bulan ini (sejauh ini)</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktivitas Situs</CardTitle>
              <BarChartHorizontal className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5.2%</div>
              <p className="text-xs text-muted-foreground">Login minggu ini (Placeholder)</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Manajemen Pengguna Admin</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-6 w-6 text-primary" />
              Akun Admin
            </CardTitle>
            <CardDescription>Kelola pengguna yang memiliki akses ke panel admin ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium whitespace-nowrap">{admin.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{admin.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{admin.role}</TableCell>
                      <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${admin.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                              {admin.status}
                          </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" /> <span className="sr-only">Tindakan</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSimulatedAction("Edit Peran", admin.name)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Peran
                            </DropdownMenuItem>
                            {admin.status === "Aktif" ? (
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleSimulatedAction("Nonaktifkan Admin", admin.name)}>
                                <UserX className="mr-2 h-4 w-4" /> Nonaktifkan
                              </DropdownMenuItem>
                            ) : (
                               <DropdownMenuItem onClick={() => handleSimulatedAction("Aktifkan Admin", admin.name)}>
                                  <Users className="mr-2 h-4 w-4" /> Aktifkan
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <Button variant="outline" className="mt-4" onClick={() => handleSimulatedAction("Tambah Admin Baru")}>
                Tambah Admin Baru
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Manajemen Akun Pengguna Akhir</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Pengguna Terdaftar
            </CardTitle>
            <CardDescription>Lihat dan kelola akun pengguna akhir dan langganan Sentinel Ubot.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pengguna</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Status Akun</TableHead>
                    <TableHead>Status Userbot</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEndUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{user.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{user.plan}</TableCell>
                      <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${user.accountStatus === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {user.accountStatus}
                          </span>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{user.userbotStatus}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" /> <span className="sr-only">Tindakan</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={() => handleSimulatedAction("Lihat Detail Pengguna", user.email)}>
                              <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSimulatedAction("Kelola Langganan", user.email)}>
                              <Edit className="mr-2 h-4 w-4" /> Kelola Langganan
                            </DropdownMenuItem>
                             {user.accountStatus === "Aktif" && (
                              <DropdownMenuItem className="text-orange-600 focus:text-orange-700" onClick={() => handleSimulatedAction("Tangguhkan Akun", user.email)}>
                                  <ShieldAlert className="mr-2 h-4 w-4" /> Tangguhkan Akun
                              </DropdownMenuItem>
                             )}
                            <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => handleSimulatedAction("Cabut Langganan", user.email)}>
                              <BadgeX className="mr-2 h-4 w-4" /> Cabut Langganan
                            </DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleSimulatedAction("Hapus Pengguna Secara Permanen", user.email)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus Pengguna
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-primary" />
              Konfigurasi Situs
            </CardTitle>
            <CardDescription>
              Sesuaikan pengaturan dan parameter aplikasi global.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              (Placeholder untuk opsi konfigurasi situs, mis., mode pemeliharaan, tanda fitur, kunci API, pengaturan notifikasi.)
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Log Sistem
            </CardTitle>
            <CardDescription>
              Pantau log aplikasi dan kejadian sistem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              (Placeholder untuk antarmuka penampil log, mis., filter log berdasarkan level, tanggal, atau komponen. Tautan ke sistem pencatatan yang lebih detail.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
