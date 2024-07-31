/* 

Achieve: 
1./:category/:articleId/:slug	
2./article/:articleId 跳轉到1
4./channel/:categoryId/:slug
3./zone/:zoneId/:slug

Test:
- article
http://localhost:3000/anything/1
http://localhost:3000/anything/2
http://localhost:3000/anything/3
http://localhost:3000/anything/4
- zone & channel
Change anything to zone & channel in the above url

https://hk01.slack.com/archives/C01UEB5PPU4/p1722407121121669?thread_ts=1722335940.224369&cid=C01UEB5PPU4

*/

import Header from "../_components/header";
import { redirect } from "next/navigation";

const article = [
  {
    id: "1",
    zone: "1",
    title: "Article 1",
    content: "Content of article 1"
  },
  {
    id: "2",
    zone: "2",
    title: "Article-2",
    content: "Content of article 2"
  },
  {
    id: "3",
    channel: "3",
    title: "文章3",
    content: "Content of article 3"
  }
];
const zone = [
  {
    id: "1",
    title: "Zone 1",
    content: "Content of zone 1"
  },
  {
    id: "2",
    title: "Zone-2",
    content: "Content of zone 2"
  },
  {
    id: "3",
    title: "区块3",
    content: "Content of zone 3"
  }
];

const channel = [
  {
    id: "1",
    title: "Channel 1",
    content: "Content of channel 1"
  },
  {
    id: "2",
    title: "Channel-2",
    content: "Content of channel 2"
  },
  {
    id: "3",
    title: "渠道3",
    content: "Content of channel 3"
  }
];
const fetchedData: any = {
  article,
  zone,
  channel
}

const getTypeTitle = (type: string, _id: string) => {
  const item = fetchedData[type].find((item: any) => item.id === _id);
  const _type = "zone" in item ? "zone" : "channel" in item ? "channel" : null;
  const _typeTitle = _type && fetchedData[_type].find((_item: any) => item[_type] === _item.id).title;
  return encodeURIComponent(_typeTitle);
}

const Page = ({ type, id }: { type: string, id: string }) => {
  const item = fetchedData[type].find((item: any) => item.id === id);

  return (
    <>
      <Header />
      <div>
        <h2>{item.title}</h2>
        <h3>{decodeURIComponent(getTypeTitle(type, id))}</h3>
        <p>{item.content}</p>
      </div>
    </>
  )
}

const NotFound = () => {
  return (
    <>
      <Header />
      <div>
        <h2>Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </>
  )
}

const host = "http://localhost:3000";

export default async function Anypath({ params }: { params: { anypath: string } }) {
  const { anypath } = params;
  const typeOri = anypath[0];
  const id = anypath[1];
  const title = anypath[2];

  // If the path exists in the filesystem, it will be rendered.
  // If not, the user will be redirected to this [...anypath] file.

  // may redirect to other pages conditonally
  const routes = {
    "test": "/about",
    "test/deep": "/about/company",
    "test/even/deeper": "/about/company/another"
  }
  // @ts-ignore
  // redirect(routes[anypath.join("/")]);
  // redirect("/about1");

  const renderContent = (type: string, id: string) => {
    const isArticle = type === "article";
    const itemMatched = fetchedData[type].find((item: any) => item.id === id);
    if (itemMatched) {
      const matchedTitle = encodeURIComponent(itemMatched.title);
      const matchedTypeTitle = getTypeTitle(type, id);
      if ((!isArticle && matchedTitle === title)
        || (isArticle && matchedTypeTitle === typeOri && matchedTitle === title)) {
        return <Page type={type} id={id} />
      }
      redirect(`${host}/${isArticle ? matchedTypeTitle : type}/${id}/${matchedTitle}`);
    } else {
      // try `/zone/4` or `/channel/4`
      return <NotFound />
    }
  };

  if (/^\d+$/g.test(id)) {
    if (typeOri === "zone" || typeOri === "channel") {
      return renderContent(typeOri, id);
    } else {
      return renderContent("article", id);
    }
  } else {
    return (
      <>
        <Header />
        <h1>Any path</h1>
        <p><b>Array param "anypath":</b> {JSON.stringify(anypath, null, 2)}</p>
        {/* @ts-ignore */}
        <p><b>Pathname:</b> {anypath.join("/")}</p>
      </>
    );
  }
}
