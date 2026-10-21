import type { ServerProps } from "payload";

import Nav from "./Nav";

type NavWithGroupsProps = {
    groupsConfig?: Record<string, { icon: string; name: string }>;
} & ServerProps;

const NavWithGroups = (props: NavWithGroupsProps) => {
    return <Nav {...props} groupsConfig={props.groupsConfig} />;
};

export default NavWithGroups;