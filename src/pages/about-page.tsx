export const AboutPage = () => (
  <>
    <div className="space-y-2">
      <h1 className="text-xl font-bold">About</h1>
      <p className="text-muted-foreground">
        Trekking Food helps you plan meals and supplies for hiking trips: products, recipes, categories, and per-hiking
        food plans with shopping lists and pack distribution.
      </p>
      <p className="text-muted-foreground">
        This is the second version of the project. The{" "}
        <a
          href="https://trekking-food.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 cursor-pointer"
        >
          first version
        </a>{" "}
        was created in 2025.
      </p>
    </div>
    <div className="space-y-2 mt-4">
      <h2 className="text-lg font-bold">Main features</h2>
      <p className="text-muted-foreground">todo: List of main features</p>
    </div>
  </>
);
