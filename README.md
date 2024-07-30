A little parser combinator library for TypeScript loosely based off of [this paper][1] and very heavily inspired by Haskell packages; primarily [Parsec][2], [Megaparsec][4] and [Parser-Combinators][3], which are awesome.

It's designed for readability and productivity, whilst being **as tiny as possible**. It's **not** designed for speed. I highly suggest you look into other solutions if speed is your main priority!

[1]: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/parsec-paper-letter.pdf
[2]: https://hackage.haskell.org/package/parsec
[3]: https://hackage.haskell.org/package/parser-combinators
[4]: https://hackage.haskell.org/package/megaparsec

## Space Efficiency

Mothwing **avoids string operations as much as it can**. Instead of slicing the input string, it keeps track of the parser's position with a numeric index.

Because of this, space leaks often found in parser combinator libraries **do not affect** Mothwing.
