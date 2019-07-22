var selectors = [
  "#ContentPlaceHolder1_mainboxes > div > div > div.col-md-6.col-lg-4.u-ver-divider.u-ver-divider--none-md > div:nth-child(1) > div > a",
  "#ContentPlaceHolder1_mainboxes > div > div > div.col-md-6.col-lg-4.u-ver-divider.u-ver-divider--none-md > div:nth-child(3) > div > a",
  "#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div:nth-child(3) > div.col-md-8",
  "#ContentPlaceHolder1_spanValue",
  "#ContentPlaceHolder1_spanTxFee",
];

main(selectors);

function main(selectors) {
  // in case the content script was injected after the page is partially loaded
  doDelete(document.querySelectorAll(selectors.join(",")));

  var mo = new MutationObserver(process);
  mo.observe(document, { subtree: true, childList: true });
  document.addEventListener("DOMContentLoaded", function() {
    mo.disconnect();
  });

  function process(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var nodes = mutations[i].addedNodes;
      for (var j = 0; j < nodes.length; j++) {
        var n = nodes[j];
        if (n.nodeType != 1)
          // only process Node.ELEMENT_NODE
          continue;
        handlePriceNode(n);
      }
    }
  }

  function doDelete(nodes) {
    [].forEach.call(nodes, function(node) {
      node.remove();
    });
  }

  function handlePriceNode(n) {
    // Front page Ether price
    if (n.matches(selectors[0])) {
      n.href = "";
      n.innerHTML = '1 ETH <span class="text-secondary"> (0.00%) </span>';
    }
    // Front page market cap
    if (n.matches(selectors[1])) {
      n.href = "";
      n.innerHTML = ">100,000,000 ETH";
    }
    // Account value
    if (n.matches(selectors[2])) {
      var etherBalance = document.querySelector(
        "#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div:nth-child(1) > div.col-md-8",
      );
      n.innerHTML = "Not Available"; // etherBalance.innerHTML;
    }
    // Transaction page value
    if (n.matches(selectors[3])) {
      n.innerHTML = `${n.innerHTML.substring(0, n.innerHTML.indexOf("</span>"))}`;
    }
    // Transaction page fee
    if (n.matches(selectors[4])) {
      n.innerHTML = `${n.innerHTML.substring(0, n.innerHTML.indexOf(" Ether"))}`;
    }
  }
}

// Chrome pre-34
if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.webkitMatchesSelector;
