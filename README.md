# Apex Motors

A responsive dealership brochure site for Apex Motors, built with Next.js App Router, Tailwind CSS, Framer Motion, GSAP ScrollTrigger and React Three Fiber.

## Local setup

1. Install Node.js 18.17+.
2. From the project directory, install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000). Check code with `npm run lint`, create a production build with `npm run build`, then serve it with `npm start`.

## Deploy to Vercel

1. Push this project to a Git provider.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected Next.js framework preset and default build settings.
4. Select **Deploy**. No environment variables are required for the brochure site.

## Content and visual customisation

- **Copy, contact details, inventory, testimonials, FAQs and body types:** edit the exports in [`content.js`](./content.js). `cars` is the single source for inventory, filters and vehicle detail routes; use a unique `slug` for each car.
- **Colours, fonts, layout and motion styling:** edit the CSS variables at the top of [`app/globals.css`](./app/globals.css), then update the component styles below as needed. Racing red is `--red`; the base colours are `--ink` and `--paper`.
- **Sections and interactions:** [`components/home.js`](./components/home.js) contains the homepage, calculator, booking form, testimonials, FAQ and pinned hero. Shared site navigation/footer are in [`components/site.js`](./components/site.js).
- **3D hero:** [`components/car-scene.js`](./components/car-scene.js) loads a real, separately meshed sports car from [`public/models/apex-sports-car.glb`](./public/models/apex-sports-car.glb). Scroll moves its actual body shell, lights, underbody, exhaust and four wheels, alongside modeled doors, engine, cabin, chassis and suspension. The model is **Mazda RX-7 by IvOfficial, CC-BY 3.0**, from [Poly Pizza](https://poly.pizza/m/SnIoWlh7S2); see [`public/models/CREDITS.md`](./public/models/CREDITS.md) for attribution. The GLB is Meshopt-compressed to approximately 330 KB while retaining its named parts. The supplied exploded-car artwork in [`public/images/apex-exploded-car/`](./public/images/apex-exploded-car/) is reserved for the low-power/no-WebGL CSS fallback and reduced-motion static image. Replace the GLB and update the mesh names in `car-scene.js` to change the 3D vehicle. Keep replacement models under 5 MB and use gltf-transform's `meshopt` command to compress without merging assembly parts:

  ```bash
  npx @gltf-transform/cli meshopt public/models/source.glb public/models/apex-car.glb
  ```

  Preserve the existing `progress`-driven assembly animation when replacing the model. The CSS image-slice fallback activates for low-core devices and browsers without WebGL; reduced-motion preference shows the supplied image as a static composition.
- **Scroll reveals:** Homepage sections fade and rise into view using Framer Motion in [`components/home.js`](./components/home.js). They play once and turn off automatically for visitors who prefer reduced motion.
- **Vehicle imagery:** replace image URLs in [`content.js`](./content.js). They currently use Unsplash image endpoints; use licensed, locally stored imagery for production if preferred.

## Routes

- `/` — homepage and scroll-driven hero
- `/inventory` — filterable and sortable inventory
- `/inventory/[slug]` — vehicle details
- `/about`, `/financing`, `/contact` — dealership information and enquiries
- unmatched routes — branded 404 page

Contact and newsletter forms demonstrate client-side validation and success states. Connect them to a CRM or form endpoint before relying on them to deliver enquiries; submissions are not persisted by this starter.
# ApexMotors
