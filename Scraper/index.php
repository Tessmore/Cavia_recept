<?php

parse_str(implode('&', array_slice($argv, 1)), $_GET);

function remove_intro($summary) {
    return preg_replace('/Een lekker [a-z\- ]* recept\. /i', "", $summary);
}

function remove_type($summary) {
    return preg_replace('/(het|de) [a-z\- ]* bevat de volgende ingrediënten: /i', "", $summary);
}

function clean_summary($summary) {
    return str_replace(" en ", ', ', remove_intro(remove_type($summary)));
}

function get_type($summary) {
    preg_match('/(Het|De) ([a-zA-Z\- ]*) bevat de volgende/', $summary, $tmp);
    return isset($tmp[2]) ? $tmp[2] : 'hoofdgerecht';
}

function get_kitchen($summary) {
    preg_match('/Een lekker ([a-zA-Z\- ]*) recept/', $summary, $tmp);
    return isset($tmp[1]) ? $tmp[1] : 'wereldkeuken';
}

function raw_json_encode($input) {

    $out = preg_replace_callback(
        '/\\\\u([0-9a-zA-Z]{4})/',
        function ($matches) {
            return mb_convert_encoding(pack('H*',$matches[1]),'UTF-8','UTF-16');
        },

        json_encode($input)
    );

    return str_replace("\/", "/", $out);

}

function starts_with($haystack, $needle) {
    return strpos($haystack, $needle) === 0;
}

function get_page($page=1) {
  $per_page = $page * 24;
  $url = "http://www.ah.nl/allerhande/assembler?assemblerContentCollection=/content/Shared/Recipe%20Results%20List&No=$per_page&format=json";

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $response = curl_exec($ch);

  curl_close($ch);

  $response = json_decode($response, true);
  return $response['contents'][0]['records'];
}

$result  = array();
$records = array();

for ($i = $_GET['start']; $i < $_GET['end']; $i++)
    $records = array_merge($records, get_page($i));


foreach ($records as $record) {

    $id = $record['attributes']['id'][0];

    // Skip video / list headers
    if (starts_with($id, 'R')) {
        if (! isset($record['attributes']['title']))
            continue;

        $result[] = array(
            'id'          => $id,
            'name'        => $record['attributes']['title'][0],
            'kitchen'     => get_kitchen($record['attributes']['summary'][0]),
            'type'        => get_type($record['attributes']['summary'][0]),
            'ingredients' => explode(', ', clean_summary($record['attributes']['summary'][0]))
        );
    }
}

print raw_json_encode($result);