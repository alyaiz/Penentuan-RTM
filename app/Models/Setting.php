<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];
    public $timestamps = true;

    public static function get(string $key, $default = null)
    {
        $row = static::query()->where('key', $key)->first();
        return $row ? static::castValue($row->value) : $default;
    }

    public static function set(string $key, $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => is_scalar($value) ? (string) $value : json_encode($value)]
        );
    }

    private static function castValue(?string $value)
    {
        if ($value === null) return null;
        if (is_numeric($value)) return $value + 0;
        $json = json_decode($value, true);
        return json_last_error() === JSON_ERROR_NONE ? $json : $value;
    }
}
