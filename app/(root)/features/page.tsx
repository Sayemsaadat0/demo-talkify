import FeatureContainer from "@/components/features/FeatureContainer"
import Breadcrumb from "@/components/shared/breadcrumb"

const page = () => {
    return (
        <div>
            <Breadcrumb title={"Our Features"} breadcrumb="Features" />
            <div className=" mx-auto">
                <FeatureContainer />
            </div>
        </div>
    )
}
export default page