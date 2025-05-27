import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, ExternalLink } from "lucide-react"

export default function TemplatesPage() {
  return (
    <div className="container py-10 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Templates</h1>
        <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
          Ready-to-use templates to help you get started with ConnectX quickly.
        </p>
      </div>

      <Tabs defaultValue="web" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="web">Web Templates</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Templates</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="web" className="space-y-8">
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <div className="group rounded-lg border overflow-hidden bg-background transition-all hover:shadow-lg">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/dxjomgo1o/image/upload/v1748325748/photo_2025-05-27_09-00-37_yiapio.jpg"
                    alt="Next.js ConnectX Template"
                    width={500}
                    height={300}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    {/* <Button className="bg-[#02569B] hover:bg-[#02569B]/90">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button> */}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sm text-muted-foreground">Web Application</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Next.js</div>
                    <div className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">React</div>
                    <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">TypeScript</div>
                    <div className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Tailwind CSS</div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">ConnectX API</div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">ConnectX Web Template</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A complete Next.js template with ConnectX integration, featuring modern UI components, 
                    authentication, and real-time features.
                  </p>
                  <div className="flex gap-3">
                    <Link href="https://github.com/maajidAwol/ConnectX/tree/main/template" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    </Link>
                    {/* <Link href="#" className="flex-1">
                      <Button className="bg-[#02569B] hover:bg-[#02569B]/90 w-full">
                        Use Template
                      </Button>
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-8">
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <div className="group rounded-lg border overflow-hidden bg-background transition-all hover:shadow-lg">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/dxjomgo1o/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1748325478/photo_2025-05-27_08-57-31_nuzb9d.jpg"
                    alt="Flutter ConnectX Template"
                    width={500}
                    height={300}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      {/* <Button className="bg-[#02569B] hover:bg-[#02569B]/90">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Preview
                      </Button> */}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sm text-muted-foreground">Mobile Application</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">Flutter</div>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Dart</div>
                    <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Material Design</div>
                    <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">ConnectX API</div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Provider</div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">ConnectX Mobile Template</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A cross-platform Flutter template with ConnectX SDK integration, featuring native 
                    performance, beautiful UI, and seamless connectivity.
                  </p>
                  <div className="flex gap-3">
                    <Link href="https://github.com/maajidAwol/ConnectX/tree/main/mobile/ConnectX" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    </Link>
                    {/* <Link href="#" className="flex-1">
                      <Button className="bg-[#02569B] hover:bg-[#02569B]/90 w-full">
                        Use Template
                      </Button>
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
