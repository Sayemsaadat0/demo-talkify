import Footer from "@/components/shared/footer"
import Header from "@/components/shared/header"

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
export default layout