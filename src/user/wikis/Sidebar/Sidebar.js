import React, { useEffect } from "react";
import "./Sidebar.scss";
import ReactMarkdown from "react-markdown";
import PagesDisplay from "./PagesDisplay/PagesDisplay";
import EditButton from "@material-ui/icons/EditOutlined";

const Sidebar = (props) => {
  useEffect(() => {
    const allLinks = document.querySelectorAll(".wiki-sidebar a");
    Array.prototype.forEach.call(allLinks, (link) => {
      let text = link.textContent;
      if (text[0] === "$") {
        text = text.substring(1, text.lastIndexOf("$"));
        link.textContent = text;
        if (props.pages.filter((page) => page.title === text).length === 0)
          link.style.color = "red";
        link.addEventListener("click", (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          props.setView(link.textContent);
        });
      } else {
        link.innerHTML = `<span>🔗</span>${link.textContent}`;
      }
    });
  }, []);
  return (
    <div className="wiki-sidebar">
      <PagesDisplay
        pages={props.pages.slice(1)}
        setView={props.setView}
      />
      <div className="wiki-sidebar-navigator">
        {props.isAdmin && (
          <EditButton
            onClick={() => props.edit(false, true)}
            className="edit-button"
          />
        )}
        <ReactMarkdown source={props.content} />
      </div>
    </div>
  );
};

export default Sidebar;
