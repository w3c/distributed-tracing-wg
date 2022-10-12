# Distributed Tracing Working Group Style Guide

This document describes the editorial style preferred by the W3C Distributed Tracing Working Group.
Where possible and appropriate, the rules in this document should be followed when making pull requests to repositories maintained by the working group.
If a rule is not appropriate or possible in context, it may be acceptable to break the rule with the consent of the working group members reviewing a pull request.
If it is not obvious why a rule is broken, a comment should be made in the document describing the reason.

# Markdown

The following section applies to all markdown files.

## File extension

All markdown files should have the extension `.md`.

## Line Breaks

Each sentence should be on its own line.
This allows for a pull request review to make a suggestion to an individual sentence,
which is a natural unit of language, without changing the line breaks for unrelated lines.
If a line is particularly long, it may also be broken on other punctuation such as commas or semicolons.

```markdown
This is a full sentence.
This is another full sentence, which is longer but still continues to be on the same line.
This is yet another full sentence, which is quite a bit longer than previous sentences,
and has a line break after a comma in order to keep line lengths reasonable.
```

## Referencing external RFCs

When referencing an external document such as an RFC,
a markdown link of the form `[RFC0000 Section x.y](https://link.to.rfc/section)` should be used.
Note that the link includes the RFC number and relevant section.

Example:

```markdown
Values can be combined in a single header according to [RFC 7230 Section 3.2.2](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.2).
```

## Referencing fields

When referencing a field which is defined in the same document,
a markdown link of the form ```[`field-name`](#field-definition)``` should be used where `field-name` is the name of the field and `#field-definition` is the HTML anchor of the heading where the field is defined.

Example:

```markdown
In some tracing systems, this is known as the [`span-id`](#span-id), where a `span` is the execution of a client request.
```
