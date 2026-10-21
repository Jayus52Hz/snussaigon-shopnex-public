import Overview from "@/components/overview";
import { getOrders } from "@/services/orders";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
    const orders = await getOrders();
    return <Overview orders={orders} />;
}
