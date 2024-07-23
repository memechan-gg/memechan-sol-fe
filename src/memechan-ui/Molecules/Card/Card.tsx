import React, { ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
}

interface ContentProps {
  //   additionalStyles?: HTMLProps<HTMLElement>["className"];
}

interface CardProps extends BaseProps, ContentProps {}

interface HeaderProps extends BaseProps, ContentProps {}

interface BodyProps extends BaseProps, ContentProps {}

interface FooterProps extends BaseProps, ContentProps {}

const getChildrenOnDisplayName = (children: ReactNode, displayName: string) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type && (child.type as any).displayName === displayName) {
      return child;
    }
    return null;
  });
};

export const Card = (props: CardProps) => {
  const { children } = props;
  const header = getChildrenOnDisplayName(children, "Header");
  const body = getChildrenOnDisplayName(children, "Body");
  const footer = getChildrenOnDisplayName(children, "Footer");

  console.log(header);
  return (
    <div className="card-shadow card-bg border border-mono-400 rounded-sm ">
      {header}
      {body}
      {footer}
    </div>
  );
};

export const Header = (props: HeaderProps) => {
  return <div className="h-8 bg-mono-400 p-4 flex items-center text-mono-600">{props.children}</div>;
};

export const Body = (props: BodyProps) => {
  return <div className="p-4 bg-mono-200">{props.children}</div>;
};

export const Footer = (props: FooterProps) => {
  console.log(props.children);
  return <div className="h-8 bg-mono-400 p-4 flex items-center">{props.children}</div>;
};

Header.displayName = "Header";
Card.Header = Header;

Body.displayName = "Body";
Card.Body = Body;

Footer.displayName = "Footer";
Card.Footer = Footer;
