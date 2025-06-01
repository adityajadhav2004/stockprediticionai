// This is a client-side only file that imports GSAP
// In a real project, you would install GSAP via npm
// For this demo, we'll use the CDN version

export const initGSAP = () => {
  // This function will be called on the client side to initialize GSAP
  if (typeof window !== "undefined") {
    // Add GSAP script to the document
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
    script.async = true
    document.body.appendChild(script)

    // Add ScrollTrigger plugin
    const scrollTriggerScript = document.createElement("script")
    scrollTriggerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
    scrollTriggerScript.async = true
    document.body.appendChild(scrollTriggerScript)
  }
}

// Helper function to animate elements
export const animateElement = (element: HTMLElement, animation: any) => {
  if (typeof window !== "undefined" && window.gsap) {
    window.gsap.to(element, animation)
  }
}

