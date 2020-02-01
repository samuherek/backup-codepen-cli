function scrapeX() {
  const lsData = localStorage.getItem("cp");
  const data = lsData ? JSON.parse(lsData) : [];

  const items = document.querySelectorAll(".item-in-list-view");

  // the structure is like this
  // td -> title
  //  -  a -> href link
  // td -> preview (skpi this)
  // td -> date created
  // td -> date updated
  // td -> list stats
  //  - hearts
  //  - comments
  //  - views
  const nextData = [...items].map((item, index) => {
    return [...item.childNodes].reduce((acc, child, i) => {
      // 1st td is title
      if (i === 0) {
        acc.title = child.innerText;
        acc.link = [...child.children].filter(a => a.nodeName === "A")[0].href;
        // 3nd td date created
      } else if (i === 2) {
        acc.createdAt = child.innerText;
        // 4th td is date updated
      } else if (i === 3) {
        acc.updatedAt = child.innerText;
        // 5th td is stats
      } else if (i === 4) {
        const [hearts, comments, views] = child.innerText.split("\n");
        acc.hearts = hearts;
        acc.comments = comments;
        acc.views = views;
      }

      return acc;
    }, {});
  });

  console.log([...data, ...nextData]);

  localStorage.setItem("cp", JSON.stringify([...data, ...nextData]));
}

function next() {
  const nextBtn = [
    ...document.querySelectorAll(".react-pagination-button")
  ].pop();
  nextBtn.click();
}

// scrape();
