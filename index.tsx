import React from "react";
import { dehydrate, useQuery, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { client } from "@lib/api";
import {
  sanitizeDepartments,
  sanitizeIndex,
  sanitizeFooter,
} from "@lib/sanitize/pages/index";
import Box from "@atoms/box";
import BecomeMemberCTA from "@organisms/become-member-cta";
import Testimonials from "@organisms/testimonials";
import Base from "@templates/base";
import Hero from "@pages-components/index/hero";
import Departments from "@pages-components/index/departments";
import Membership from "@pages-components/index/membership";
import InnerCircles from "@pages-components/index/innercircles";
import Events from "@pages-components/index/events";
import Learning from "@pages-components/index/learning";
import Solutions from "@pages-components/index/solutions";
import Footer from "@pages-components/index/footer";
import axios from "axios";

const Home: NextPage = () => {
  const { data } = useQuery(["index"], fetchPage);
  const { data: footerData } = useQuery(["footer"], fetchFooter);
  const { data: departmentsData } = useQuery(["departments"], fetchDepartments);

  return (
    <Base>
      <Hero {...data?.hero} />

      <Box css={{ mt: "48px", "@lg": { mt: "96px" }, "@xl": { mt: "120px" } }}>
        <Departments items={departmentsData} />
      </Box>

      <Box css={{ mt: "88px", "@lg": { mt: "112px" }, "@xl": { mt: "140px" } }}>
        <Membership />
      </Box>

      <Box css={{ mt: "96px", "@lg": { mt: "192px" }, "@xl": { mt: "240px" } }}>
        <InnerCircles {...data?.innercircles} />
      </Box>

      <Box css={{ mt: "96px", "@lg": { mt: "192px" }, "@xl": { mt: "240px" } }}>
        <Events />
      </Box>

      <Box css={{ mt: "96px", "@lg": { mt: "192px" }, "@xl": { mt: "240px" } }}>
        <Learning {...data?.learning} />
      </Box>

      <Box css={{ mt: "96px", "@lg": { mt: "192px" }, "@xl": { mt: "240px" } }}>
        <Solutions {...data?.solutions} />
      </Box>

      <Box css={{ mt: "48px", "@lg": { mt: "96px" }, "@xl": { mt: "120px" } }}>
        <Testimonials {...data?.testimonials} />
      </Box>

      <Box>
        <BecomeMemberCTA {...data?.becomeMember} />
      </Box>

      <Box>
        <Footer {...footerData} />
      </Box>
    </Base>
  );
};

const fetchPage = async () => {
  const parsed = await client.get("/pages?slug=home");
  const [{ acf }] = parsed.data;
  return sanitizeIndex(acf);
};

const fetchDepartments = async () => {
  const parsed = await client.get("/audiences");
  const s = sanitizeDepartments(parsed.data);
  return s;
};

const fetchFooter = async () => {
  const client = axios.create({
    baseURL: "https://devqn.wpengine.com/wp-json/menus/v1",
  });
  const linksSections = await client("/menus");
  const footerMenusResponse = await Promise.all(
    linksSections.data.map((linksSection: any) =>
      client(`/menus/${linksSection.slug}`),
    ),
  );
  return sanitizeFooter(footerMenusResponse);
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["index"], fetchPage);
  await queryClient.prefetchQuery(["departments"], fetchDepartments);
  await queryClient.prefetchQuery(["footer"], fetchFooter);
  return { props: { dehydratedState: dehydrate(queryClient) } };
}

export default Home;
