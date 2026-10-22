/**
 * Trimmed from real X4 9.00 saves: one cluster with a contested sector, stations in zones with modules, trade offers
 * and workforce, player ships (one with a trade deal order), a build plot and a job ship.
 */
export const MAP_FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<savegame>
<info>
<save name="Fixture" date="1792661326"/>
</info>
<universe>
<component class="galaxy" macro="xu_ep2_universe_macro" connection="universe" id="[0x1]">
<connections>
<connection connection="cluster_409_connection">
<component class="cluster" macro="cluster_409_macro" connection="galaxy" code="WNJ-001" id="[0x58dc]">
<connections>
<connection connection="cluster_409_sector001_connection">
<component class="sector" macro="Cluster_409_Sector001_macro" connection="cluster" code="WNJ-967" owner="freesplit" contested="1" knownto="player" id="[0x58dd]">
<connections>
<connection connection="space">
<component class="zone" macro="tempzone" connection="sector" code="EKZ-056" id="[0x6103]">
<offset>
<position x="-15042.371" y="-4650.729" z="26290.734"/>
<rotation yaw="-61.05452"/>
</offset>
<connections>
<connection connection="space">
<component class="station" macro="station_gen_factory_base_01_macro" connection="space" code="ACZ-528" owner="freesplit" knownto="player" level="0.2" id="[0x5aca]">
<listeners>
<listener listener="[0x58e2]" event="killed"/>
</listeners>
<offset>
<position x="1000" y="22.078" z="-2000"/>
<rotation yaw="-89.99995"/>
</offset>
<construction>
<sequence>
<entry id="[0x229d]" index="1" macro="pier_spl_harbor_01_macro">
<offset>
<position x="0.1216" y="22.078" z="338.595"/>
</offset>
</entry>
<entry id="[0x229e]" index="2" macro="prod_gen_energycells_01_macro"/>
<entry id="[0x229f]" index="3" macro="pier_spl_harbor_01_macro"/>
</sequence>
</construction>
<trade>
<offers>
<production>
<trade id="[0x362f]" buyer="[0x5aca]" ware="energycells" price="1241" amount="1377" desired="1377" flags="invertfactionrestriction">
<source class="production"/>
</trade>
<trade id="[0x3631]" seller="[0x5aca]" ware="smartchips" price="6670" amount="3762" flags="invertfactionrestriction">
<source class="production"/>
</trade>
<trade id="[0x3632]" buyer="[0x5aca]" ware="cheltmeat" price="3687" desired="69" flags="invertfactionrestriction">
<source class="production"/>
</trade>
<trade id="[0x3634]" buyer="[0x5aca]" ware="majadust" price="41285" amount="154" desired="154" flags="buyercargovirtual|buyermoneyvirtual|invertfactionrestriction|shady">
<source class="production"/>
<restrictions factions="player"/>
</trade>
</production>
</offers>
<prices>
<reference>
<ware ware="energycells" buy="15" sell="0"/>
</reference>
</prices>
</trade>
<workforces lasttime="39103.06">
<workforce race="split" amount="180"/>
<workforce race="argon" amount="20"/>
<bonus value="1" endtime="40196.411" busy="0"/>
</workforces>
<production endtime="39633.565" originalproduct="smartchips"/>
</component>
</connection>
</connections>
</component>
<component class="zone" macro="tempzone" connection="sector" code="QJS-363" id="[0x6259]">
<offset>
<position x="20000" y="0" z="-30000"/>
</offset>
<connections>
<connection connection="space">
<component class="station" macro="station_gen_factory_base_01_macro" connection="space" code="XUS-725" owner="freesplit" basename="{20102,1701}" state="construction" id="[0x5b2c]">
</component>
</connection>
</connections>
</component>
<component class="zone" macro="zone004_cluster_409_sector001_macro" connection="sector" code="WYZ-650" id="[0x58df]">
<offset default="1"/>
<connections>
<connection connection="space">
<component class="station" macro="station_gen_prod_energycells_macro" connection="space" code="HIB-700" owner="split" name="{20103,2001}" basename="{20103,2001}" id="[0x5e28]">
<offset>
<position x="3000" y="0" z="-4000"/>
</offset>
<production endtime="39633.565" originalproduct="energycells"/>
<construction>
<sequence>
<entry id="[0x2301]" index="1" macro="prod_gen_energycells_01_macro"/>
<entry id="[0x2302]" index="2" macro="prod_gen_energycells_01_macro"/>
<entry id="[0x2303]" index="3" macro="dock_arg_m_01_macro"/>
</sequence>
</construction>
</component>
</connection>
</connections>
</component>
<component class="buildstorage" macro="buildstorage_gen_base_01_macro" connection="space" code="OSK-129" owner="freesplit" id="[0x58e2]">
<offset>
<position x="5" y="0" z="5"/>
</offset>
</component>
</connection>
</connections>
<component class="station" macro="station_pir_base_01_macro" connection="space" code="PLR-001" owner="player" knownto="player" nameindex="2" wreck="0" id="[0x48a00]">
<offset>
<position x="55555" y="0" z="-12345"/>
</offset>
<connections>
<connection connection="dock">
<component class="ship_s" macro="ship_arg_s_fighter_01_a_macro" connection="dock" code="DKD-111" owner="player" knownto="player" id="[0x48a10]"/>
</connection>
</connections>
</component>
<component class="ship_l" macro="ship_arg_l_destroyer_01_a_macro" connection="space" code="DST-222" owner="player" knownto="player" id="[0x48a13]">
<component class="npc" macro="character_pilot_macro" connection="parentconnection" owner="player" id="[0x48a18]"/>
</component>
<component class="ship_m" macro="ship_spl_m_trans_01_a_macro" connection="space" code="NPC-333" owner="split" knownto="player" id="[0x48a20]">
<orders>
<order order="TradeRoutine" default="1">
<param name="tradedeal" type="trade">
<trade id="[0x3699]" seller="[0x5aca]" ware="smartchips" price="6000" amount="100"/>
</param>
</order>
</orders>
<trade>
<offers>
<production>
<trade id="[0x3700]" seller="[0x48a20]" ware="water" price="5000" amount="10"/>
</production>
</offers>
</trade>
</component>
</component>
</connection>
</connections>
</component>
</connection>
</connections>
</component>
<jobs>
<job id="trader">
<component class="ship_s" macro="ship_arg_s_trans_01_a_macro" code="JOB-444" owner="player" id="[0x48a30]"/>
</job>
</jobs>
</universe>
</savegame>
`;
