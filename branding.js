(function () {
  var iconUrl = "/favicon.ico?v=20261008";


  function preserveHomepageBranding() {
    var isLoaderPage = document.getElementById("s") && document.querySelector('script[src="c0.js"]');
    if (!isLoaderPage) return;


    var nativeOpen = document.open.bind(document);
    var nativeWrite = document.write.bind(document);
    var brandedWrite = function () {
      var args = Array.prototype.slice.call(arguments);
      if (args.length) {
        args[0] = String(args[0]).replace(/<\/body>/i, '<script src="/branding.js"></script></body>');
      }
      return nativeWrite.apply(document, args);
    };


    document.open = function () {
      var result = nativeOpen.apply(document, arguments);
      document.write = brandedWrite;
      return result;
    };
    document.write = brandedWrite;
  }


  function setFavicon() {
    var old = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    for (var i = 0; i < old.length; i += 1) old[i].remove();


    var icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/x-icon";
    icon.href = iconUrl;
    document.head.appendChild(icon);


    var touch = document.createElement("link");
    touch.rel = "apple-touch-icon";
    touch.href = iconUrl;
    document.head.appendChild(touch);
  }


  function setHeaderLogo() {
    var brand = document.querySelector("nav a.logo");
    if (!brand || brand.dataset.scaBrandingApplied === "true") return;


    brand.dataset.scaBrandingApplied = "true";
    brand.textContent = "";
    brand.setAttribute("aria-label", "Saran Chess Academy home");
    brand.style.display = "inline-flex";
    brand.style.alignItems = "center";
    brand.style.lineHeight = "1";


    var logo = document.createElement("img");
    logo.src = "/saran-chess-academy-logo.png";
    logo.alt = "Saran Chess Academy";
    logo.decoding = "async";
    logo.style.display = "block";
    logo.style.width = "180px";
    logo.style.maxWidth = "46vw";
    logo.style.height = "auto";
    logo.style.maxHeight = "52px";
    logo.style.objectFit = "contain";
    brand.appendChild(logo);
  }


  function applyBranding() {
    setFavicon();
    setHeaderLogo();
  }


  preserveHomepageBranding();


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyBranding, { once: true });
  } else {
    applyBranding();
  }


  setTimeout(applyBranding, 200);
  setTimeout(applyBranding, 900);
})();

