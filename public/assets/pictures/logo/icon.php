<?php

declare(strict_types=1);

$relative = [];

$dir      = __DIR__;

do
{
    $base       = basename($dir);

    if ('public' === $base)
    {
        break;
    }

    $relative[] = $base;
} while ($dir = dirname($dir));

$relative = sprintf('./%s/', implode('/', array_reverse($relative)));

foreach (scandir(__DIR__) as $file)
{
    if ( ! str_ends_with($file, '.png') && ! str_ends_with($file, '.webp'))
    {
        continue;
    }

    $arr = explode('.', $file);
    $ext = array_pop($arr);

    if (preg_match('#(\d+)#', $file, $matches))
    {
        [,$size] = $matches;

        printf(
            '<link rel="shortcut icon" href="%s" sizes="%sx%s" type="image/%s">' . "\n",
            $relative . $file,
            $size,
            $size,
            $ext
        );

        if ('64' === $size)
        {
            printf(
                '<link rel="apple-touch-icon" href="%s" sizes="%sx%s" type="image/%s">' . "\n",
                $relative . $file,
                $size,
                $size,
                $ext
            );
        }
    }
}
