import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AskResponse } from "../components/ask-response";

describe("AskResponse", () => {
  it("renders the supported response formatting without rendering HTML", () => {
    const html = renderToStaticMarkup(
      <AskResponse
        text={
          "This is **important**.\n\n- Demo: https://youtu.be/example\n- GitHub: https://github.com/animesh-algorithm/visafile"
        }
      />,
    );

    expect(html).toContain("<strong>important</strong>");
    expect(html).toContain("<ul>");
    expect(html).toContain('href="https://youtu.be/example"');
    expect(html).not.toContain("<script>");
  });

  it("keeps non-HTTP URLs as text", () => {
    const html = renderToStaticMarkup(
      <AskResponse text="Avoid javascript:alert(1)." />,
    );

    expect(html).toContain("javascript:alert(1).");
    expect(html).not.toContain("href=");
  });
});
