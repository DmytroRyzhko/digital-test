import autoprefixer from 'autoprefixer';
import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { globSync } from 'glob';
import postcss from 'postcss';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const entryPoints = [
  'src/scripts/index.js',
  'src/styles/index.scss',
  ...globSync('src/chunks/{scripts,styles}/**/*.{js,scss}'),
];

const ctx = await esbuild.context({
  entryPoints,
  entryNames: '[name]',
  outdir: 'assets',
  target: 'es2020',
  sourcemap: IS_DEVELOPMENT ? 'inline' : false,
  sourcesContent: false,
  bundle: true,
  minify: true,
  plugins: [
    sassPlugin({
      cache: true,
      async transform(source) {
        const { css } = await postcss([autoprefixer]).process(source, {
          from: undefined,
          map: false,
        });

        return css;
      },
    }),
  ],
});

await ctx.rebuild();

if (IS_DEVELOPMENT) {
  await ctx.watch();
  console.log('WATCHING FOR FILE CHANGES!!!');
} else {
  await ctx.dispose();
  console.log('BUILD SUCCESS!!!');
}
