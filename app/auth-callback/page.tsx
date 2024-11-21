import { redirect } from "next/navigation";
import { CreateUserIfNull } from "@/app/auth-callback/actions";
const Page = async () => {
    const success = await CreateUserIfNull();
    if(!success) {
        return <div>Something went wrong signing you in! Contact Support</div>}
    else redirect("/");
};

export default Page;
