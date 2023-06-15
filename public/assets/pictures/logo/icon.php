<?php

declare(strict_types=1);

$relative = [];

$dir      = __DIR__;

do
{
    if (is_file($dir . '/../package.json'))
    {
        break;
    }

    $base       = basename($dir);
    $relative[] = $base;
} while ($dir = dirname($dir));

$relative = sprintf('./%s/', implode('/', array_reverse($relative)));
$images   = [];

foreach (scandir(__DIR__) as $file)
{
    if ( ! str_ends_with($file, '.png') && ! str_ends_with($file, '.webp'))
    {
        continue;
    }

    $arr = explode('.', $file);
    $ext = array_pop($arr);

    if('webp' === $ext)
    {
        continue;
    }

    if (preg_match('#(\d+)#', $file, $matches))
    {
        [,$size]                 = $matches;

        $images[$ext]["{$size}"] = $relative . $file;
    }
}

ksort($images['png']);
// ksort($images['webp']);

foreach ($images as $ext => $item):
    foreach ($item as $size => $src) :?>
<link rel="shortcut icon" href="<?= $src; ?>" sizes="<?= $size . 'x' . $size; ?>" type="image/<?= $ext; ?>">
<?php if('64' == $size && 'png' === $ext):?>
<link rel="apple-touch-icon" href="<?= $src; ?>" sizes="<?= $size . 'x' . $size; ?>" type="image/<?= $ext; ?>">
<?php endif; endforeach; endforeach;
